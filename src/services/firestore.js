import {
    addDoc,
    collection,
    doc,
    GeoPoint,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from './firebase';

// Collections
const USERS_COLLECTION = 'users';
const LOCATIONS_COLLECTION = 'locations';
const POSTS_COLLECTION = 'posts';
const COMMENTS_COLLECTION = 'comments';

// User operations
export const createUser = async (userData) => {
  try {
    const userRef = await addDoc(collection(db, USERS_COLLECTION), {
      ...userData,
      createdAt: serverTimestamp(),
    });
    return userRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION), 
      where('email', '==', email),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Location operations
export const addLocation = async (locationData) => {
  try {
    // Convert latitude/longitude to GeoPoint for Firestore
    const geoPoint = new GeoPoint(
      locationData.latitude,
      locationData.longitude
    );
    
    const locationRef = await addDoc(collection(db, LOCATIONS_COLLECTION), {
      ...locationData,
      geopoint: geoPoint,
      createdAt: serverTimestamp(),
    });
    return locationRef.id;
  } catch (error) {
    console.error('Error adding location:', error);
    throw error;
  }
};

export const getNearbyLocations = async (latitude, longitude, radiusInKm = 5) => {
  try {
    // For simplicity, we'll retrieve all locations and filter client-side
    // For production, consider using a geospatial query or a separate service like Algolia
    const locationsRef = collection(db, LOCATIONS_COLLECTION);
    const querySnapshot = await getDocs(locationsRef);
    
    const locations = [];
    querySnapshot.forEach((doc) => {
      const locationData = doc.data();
      const geopoint = locationData.geopoint;
      
      // Calculate distance using the Haversine formula
      const distance = calculateDistance(
        latitude,
        longitude,
        geopoint.latitude,
        geopoint.longitude
      );
      
      if (distance <= radiusInKm) {
        locations.push({
          id: doc.id,
          ...locationData,
          distance,
        });
      }
    });
    
    // Sort by distance
    return locations.sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Error getting nearby locations:', error);
    throw error;
  }
};

// Post operations
export const createPost = async (postData) => {
  try {
    const postRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postData,
      createdAt: serverTimestamp(),
    });
    return postRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getLocationPosts = async (locationId) => {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('locationId', '==', locationId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return posts;
  } catch (error) {
    console.error('Error getting location posts:', error);
    throw error;
  }
};

export const getUserPosts = async (userId) => {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return posts;
  } catch (error) {
    console.error('Error getting user posts:', error);
    throw error;
  }
};

// Utility function to calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
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

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};
