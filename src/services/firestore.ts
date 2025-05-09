import { addDoc, collection, doc, GeoPoint, getDoc, getDocs } from 'firebase/firestore';
import { LocationData } from '../context/LocationContext';
import { db } from './firebase';
import { calculateDistance } from './location';

// Get nearby locations using GeoFirestore
export const getNearbyLocations = async (
  latitude: number, 
  longitude: number, 
  radiusInKm: number = 5
): Promise<LocationData[]> => {
  try {
    // For testing purposes, just return all locations
    // In a real app, use GeoFirestore for proper geoqueries
    const locationsCollection = collection(db, 'locations');
    const locationsSnapshot = await getDocs(locationsCollection);
    
    const locations: LocationData[] = [];
    
    locationsSnapshot.forEach(doc => {
      const data = doc.data();
      
      // If location has valid geopoint
      if (data.geopoint && data.geopoint.latitude && data.geopoint.longitude) {
        // Calculate distance between current location and location from database
        const distance = calculateDistance(
          latitude,
          longitude,
          data.geopoint.latitude,
          data.geopoint.longitude
        );
        
        // Only include locations within the specified radius
        if (distance <= radiusInKm) {
          locations.push({
            id: doc.id,
            name: data.name || 'Unnamed Location',
            description: data.description || 'No description available',
            geopoint: {
              latitude: data.geopoint.latitude,
              longitude: data.geopoint.longitude,
            },
            address: data.address,
          });
        }
      }
    });
    
    return locations;
  } catch (error) {
    console.error('Error getting nearby locations:', error);
    return [];
  }
};

// Add a new location
export const addLocation = async (
  locationData: Omit<LocationData, 'id'> & { userId: string }
): Promise<string | null> => {
  try {
    const locationsCollection = collection(db, 'locations');
    
    const docRef = await addDoc(locationsCollection, {
      name: locationData.name,
      description: locationData.description,
      geopoint: new GeoPoint(
        locationData.geopoint.latitude,
        locationData.geopoint.longitude
      ),
      address: locationData.address || null,
      userId: locationData.userId,
      createdAt: new Date(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding location:', error);
    return null;
  }
};

// Get location by ID
export const getLocationById = async (locationId: string): Promise<LocationData | null> => {
  try {
    const locationRef = doc(db, 'locations', locationId);
    const locationSnap = await getDoc(locationRef);
    
    if (locationSnap.exists()) {
      const data = locationSnap.data();
      return {
        id: locationSnap.id,
        name: data.name || 'Unnamed Location',
        description: data.description || 'No description available',
        geopoint: {
          latitude: data.geopoint.latitude,
          longitude: data.geopoint.longitude,
        },
        address: data.address,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting location by ID:', error);
    return null;
  }
};
