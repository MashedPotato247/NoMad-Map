import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/src/context/AuthContext';
import { useLocation } from '@/src/context/LocationContext';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

// Mock data for nearby nomads - in a real app, this would come from the database
const NOMADS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    location: 'Bangkok, Thailand',
    distance: '0.8 km away',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '2',
    name: 'Michael Chen',
    location: 'Chiang Mai, Thailand',
    distance: '1.2 km away',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    location: 'Phuket, Thailand',
    distance: '2.5 km away',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: '4',
    name: 'James Davis',
    location: 'Krabi, Thailand',
    distance: '3.7 km away',
    image: 'https://randomuser.me/api/portraits/men/46.jpg',
  },
];

const ExploreScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { nearbyLocations, loadingNearby } = useLocation();
  const [activeTab, setActiveTab] = useState('locations');
  
  // Placeholder data for recommended locations
  const [recommendedLocations, setRecommendedLocations] = useState([]);
  
  useEffect(() => {
    // In a real app, this would be a personalized algorithm based on user preferences
    // For now, just sort by proximity
    if (nearbyLocations && nearbyLocations.length > 0) {
      setRecommendedLocations([...nearbyLocations].sort((a, b) => a.distance - b.distance));
    }
  }, [nearbyLocations]);
  
  // Handle location card press
  const handleLocationPress = (location) => {
    // Navigate to location detail
    // router.push(`/location/${location.id}`);
    console.log('Navigate to location:', location);
  };
  
  // Handle nomad profile press
  const handleNomadPress = (nomad) => {
    // Navigate to nomad profile
    // router.push(`/nomad/${nomad.id}`);
    console.log('Navigate to nomad:', nomad);
  };
  
  // Render a location card
  const renderLocationCard = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.locationCard}
        onPress={() => handleLocationPress(item)}
      >
        <Image
          // In a real app, this would be the location image from Firestore
          source={{ uri: item.imageUrls?.[0] || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80' }}
          style={styles.locationImage}
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.locationGradient}
        >
          <ThemedText style={styles.locationName}>{item.name}</ThemedText>
          <ThemedView style={styles.locationInfo}>
            <FontAwesome name="map-marker" size={14} color="#fff" />
            <ThemedText style={styles.locationAddress}>
              {item.address || 'No address available'}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.locationStats}>
            <ThemedView style={styles.locationStat}>
              <FontAwesome name="user" size={14} color="#fff" />
              <ThemedText style={styles.locationStatText}>
                {item.userDisplayName || 'Anonymous'}
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.locationStat}>
              <FontAwesome name="map-pin" size={14} color="#fff" />
              <ThemedText style={styles.locationStatText}>
                {item.distance ? `${item.distance.toFixed(1)} km` : 'Unknown distance'}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  
  // Render a nomad card
  const renderNomadCard = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.nomadCard}
        onPress={() => handleNomadPress(item)}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.nomadImage}
        />
        
        <ThemedView style={styles.nomadInfo}>
          <ThemedText style={styles.nomadName}>{item.name}</ThemedText>
          <ThemedText style={styles.nomadLocation}>{item.location}</ThemedText>
          <ThemedText style={styles.nomadDistance}>{item.distance}</ThemedText>
        </ThemedView>
        
        <TouchableOpacity style={styles.connectButton}>
          <ThemedText style={styles.connectButtonText}>Connect</ThemedText>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  
  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>Explore</ThemedText>
      </ThemedView>
      
      {/* Tab Buttons */}
      <ThemedView style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'locations' && styles.activeTabButton]}
          onPress={() => setActiveTab('locations')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'locations' && styles.activeTabText]}>
            Locations
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'nomads' && styles.activeTabButton]}
          onPress={() => setActiveTab('nomads')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'nomads' && styles.activeTabText]}>
            Nearby Nomads
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      {/* Content */}
      {activeTab === 'locations' ? (
        <FlatList
          data={recommendedLocations}
          renderItem={renderLocationCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => (
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Recommended Places
            </ThemedText>
          )}
          ListEmptyComponent={() => (
            <ThemedView style={styles.emptyContainer}>
              <FontAwesome name="map" size={50} color="#ccc" />
              <ThemedText style={styles.emptyText}>
                {loadingNearby ? 'Loading nearby locations...' : 'No locations found nearby'}
              </ThemedText>
            </ThemedView>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={NOMADS}
          renderItem={renderNomadCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => (
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Nomads Near You
            </ThemedText>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTabButton: {
    backgroundColor: '#4c669f',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: '600',
  },
  locationCard: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  locationImage: {
    width: '100%',
    height: '100%',
  },
  locationGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    padding: 15,
    justifyContent: 'flex-end',
  },
  locationName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationAddress: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
    opacity: 0.9,
  },
  locationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationStatText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
    opacity: 0.8,
  },
  nomadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(240, 240, 240, 0.3)',
    borderRadius: 10,
    marginBottom: 15,
  },
  nomadImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  nomadInfo: {
    flex: 1,
  },
  nomadName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  nomadLocation: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 3,
  },
  nomadDistance: {
    fontSize: 12,
    opacity: 0.5,
  },
  connectButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#4c669f',
    borderRadius: 15,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    opacity: 0.5,
    textAlign: 'center',
  },
});

export default ExploreScreen;
