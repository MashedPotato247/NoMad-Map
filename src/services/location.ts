import * as Location from 'expo-location';
import { Region } from '../context/LocationContext';

// Request location permissions
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

// Get user's current location
export const getCurrentLocation = async (): Promise<Region | null> => {
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
export const geocodeAddress = async (address: string): Promise<{latitude: number, longitude: number} | null> => {
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
export const reverseGeocode = async (latitude: number, longitude: number): Promise<string | null> => {
  try {
    const result = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    
    if (result.length > 0) {
      const { street, city, region, country } = result[0];
      return [street, city, region, country].filter(Boolean).join(', ');
    }
    
    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
};

// Calculate distance between two coordinates in kilometers
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

// Convert degrees to radians
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};
