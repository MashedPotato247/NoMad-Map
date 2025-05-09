import { LocationData, useLocation } from '@/src/context/LocationContext';
import { FontAwesome } from '@expo/vector-icons';
import MapboxGL from '@rnmapbox/maps';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Configure Mapbox with a free token for OpenStreetMap
MapboxGL.setAccessToken('');

const { width, height } = Dimensions.get('window');

interface MapComponentProps {
  onMarkerPress: (location: LocationData) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onMarkerPress }) => {
  const {
    currentRegion,
    nearbyLocations,
    loadingLocation,
    updateRegion,
    setSelectedLocation,
  } = useLocation();
  
  const mapRef = useRef<MapboxGL.MapView | null>(null);
  const cameraRef = useRef<MapboxGL.Camera | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Center map on current location when available
  useEffect(() => {
    if (currentRegion && cameraRef.current && mapReady) {
      cameraRef.current.setCamera({
        centerCoordinate: [currentRegion.longitude, currentRegion.latitude],
        zoomLevel: 14,
        animationDuration: 500
      });
    }
  }, [currentRegion, mapReady]);

  // Handle marker press
  const handleMarkerPress = (location: LocationData) => {
    setSelectedLocation(location);
    if (onMarkerPress) {
      onMarkerPress(location);
    }
  };

  // Center map on user's location
  const handleCenterMap = () => {
    if (currentRegion && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [currentRegion.longitude, currentRegion.latitude],
        zoomLevel: 14,
        animationDuration: 500
      });
    }
  };

  // When region changes, update context
  const handleRegionChange = (feature: MapboxGL.MapboxGLEvent) => {
    if (feature && feature.geometry && feature.geometry.coordinates) {
      const [longitude, latitude] = feature.geometry.coordinates;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      };
      updateRegion(newRegion);
    }
  };

  if (loadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        onRegionDidChange={handleRegionChange}
        onDidFinishLoadingMap={() => setMapReady(true)}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={14}
          centerCoordinate={
            currentRegion 
              ? [currentRegion.longitude, currentRegion.latitude]
              : [0, 0]
          }
        />
        
        <MapboxGL.UserLocation visible={true} />
        
        {nearbyLocations.map((location: LocationData) => (
          <MapboxGL.PointAnnotation
            key={location.id}
            id={location.id}
            coordinate={[
              location.geopoint.longitude,
              location.geopoint.latitude,
            ]}
            title={location.name}
            onSelected={() => handleMarkerPress(location)}
          >
            <View style={styles.annotationContainer}>
              <View style={styles.annotationFill} />
            </View>
            <MapboxGL.Callout title={location.name} />
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>
      
      {/* Location Button */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleCenterMap}
      >
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.locationButtonGradient}
        >
          <FontAwesome name="location-arrow" size={20} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Add Location Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {/* Navigate to add location screen */}}
      >
        <LinearGradient
          colors={['#00BFFF', '#1E90FF']}
          style={styles.addButtonGradient}
        >
          <FontAwesome name="plus" size={20} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3b5998',
    borderWidth: 2,
    borderColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  locationButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  addButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapComponent;
