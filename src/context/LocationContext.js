import React, { createContext, useContext, useEffect, useState } from 'react';
import { getNearbyLocations } from '../services/firestore';
import { getCurrentLocation } from '../services/location';

// Define location data type
export interface LocationData {
  id: string;
  name: string;
  description: string;
  geopoint: {
    latitude: number;
    longitude: number;
  };
  address?: string;
}

// Create context with types
export const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  // State for current region
  const [currentRegion, setCurrentRegion] = useState(null);
  
  // State for nearby locations
  const [nearbyLocations, setNearbyLocations] = useState([]);
  
  // Loading states
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingNearby, setLoadingNearby] = useState(false);
  
  // Selected location
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Initialize by getting current location
  useEffect(() => {
    const initLocation = async () => {
      try {
        const location = await getCurrentLocation();
        if (location) {
          setCurrentRegion(location);
          fetchNearbyLocations(location.latitude, location.longitude);
        }
      } catch (error) {
        console.error('Error initializing location:', error);
      } finally {
        setLoadingLocation(false);
      }
    };

    initLocation();
  }, []);

  // Fetch nearby locations
  const fetchNearbyLocations = async (latitude, longitude, radius = 5) => {
    try {
      setLoadingNearby(true);
      const locations = await getNearbyLocations(latitude, longitude, radius);
      setNearbyLocations(locations);
    } catch (error) {
      console.error('Error fetching nearby locations:', error);
    } finally {
      setLoadingNearby(false);
    }
  };

  // Update region
  const updateRegion = (region) => {
    setCurrentRegion(region);
    fetchNearbyLocations(region.latitude, region.longitude);
  };

  // Context value
  const value = {
    currentRegion,
    updateRegion,
    nearbyLocations,
    loadingLocation,
    loadingNearby,
    selectedLocation,
    setSelectedLocation,
    refreshNearbyLocations: () => {
      if (currentRegion) {
        fetchNearbyLocations(currentRegion.latitude, currentRegion.longitude);
      }
    },
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use location context
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
