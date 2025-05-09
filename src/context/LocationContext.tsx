import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
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

// Define region type
export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Define location context type
interface LocationContextType {
  currentRegion: Region | null;
  updateRegion: (region: Region) => void;
  nearbyLocations: LocationData[];
  loadingLocation: boolean;
  loadingNearby: boolean;
  selectedLocation: LocationData | null;
  setSelectedLocation: (location: LocationData | null) => void;
  refreshNearbyLocations: () => void;
}

// Create context with proper type
export const LocationContext = createContext<LocationContextType | null>(null);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  // State for current region
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  
  // State for nearby locations
  const [nearbyLocations, setNearbyLocations] = useState<LocationData[]>([]);
  
  // Loading states
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingNearby, setLoadingNearby] = useState(false);
  
  // Selected location
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

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
  const fetchNearbyLocations = async (latitude: number, longitude: number, radius = 5) => {
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
  const updateRegion = (region: Region) => {
    setCurrentRegion(region);
    fetchNearbyLocations(region.latitude, region.longitude);
  };

  // Context value
  const value: LocationContextType = {
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
export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
