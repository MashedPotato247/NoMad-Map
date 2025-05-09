import * as Location from 'expo-location';

// Request location permissions
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

// Get user's current location
export const getCurrentLocation = async () => {
  try {
    const permission = await requestLocationPermission();
    
    if (!permission) {
      return null;
    }
    
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

// Geocode an address to coordinates
export const geocodeAddress = async (address) => {
  try {
    const result = await Location.geocodeAsync(address);
    if (result.length > 0) {
      return {
        latitude: result[0].latitude,
        longitude: result[0].longitude,
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Reverse geocode coordinates to address
export const reverseGeocodeLocation = async (latitude, longitude) => {
  try {
    const result = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    
    if (result.length > 0) {
      return result[0];
    }
    return null;
  } catch (error) {
    console.error('Error reverse geocoding location:', error);
    return null;
  }
};
