import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { addLocation } from '../services/firestore';
import { getCurrentLocation, reverseGeocodeLocation } from '../services/location';

const AddLocationScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { refreshNearbyLocations } = useLocation();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [currentAddress, setCurrentAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  
  // Categories for the location
  const categories = ['Scenic View', 'Hidden Gem', 'Restaurant', 'Accommodation', 'Cultural Site', 'Adventure', 'Other'];
  
  // Get current location on component mount
  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        setIsLoadingLocation(true);
        const location = await getCurrentLocation();
        
        if (location) {
          setCoordinates({
            latitude: location.latitude,
            longitude: location.longitude,
          });
          
          // Get address from coordinates
          const address = await reverseGeocodeLocation(location.latitude, location.longitude);
          if (address) {
            const addressStr = [
              address.street,
              address.city,
              address.region,
              address.country
            ].filter(Boolean).join(', ');
            
            setCurrentAddress(addressStr);
          }
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setIsLoadingLocation(false);
      }
    };
    
    fetchCurrentLocation();
  }, []);
  
  // Pick an image from camera roll
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };
  
  // Take a photo with camera
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Permission to access camera is required!');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };
  
  // Remove an image
  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || !category || !coordinates) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real app, you would upload images to storage and get URLs
      // For this example, we'll just create the location without actual image uploads
      
      const locationData = {
        name: name.trim(),
        description: description.trim(),
        category,
        address: currentAddress,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        userId: user.id,
        userDisplayName: user.displayName || user.googleUser?.name,
        userPhotoURL: user.photoURL || user.googleUser?.picture,
        // In a real app, you would include the image URLs here
        imageUrls: [],
      };
      
      await addLocation(locationData);
      
      // Refresh nearby locations
      refreshNearbyLocations();
      
      // Navigate back to the map
      router.replace('/(tabs)');
      
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Failed to add location. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>Add New Location</ThemedText>
        
        {/* Location Name */}
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Location Name *</ThemedText>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter location name"
            placeholderTextColor="#999"
          />
        </ThemedView>
        
        {/* Description */}
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Description *</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe this location..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </ThemedView>
        
        {/* Category */}
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Category *</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.selectedCategory,
                ]}
                onPress={() => setCategory(cat)}
              >
                <ThemedText style={[
                  styles.categoryText,
                  category === cat && styles.selectedCategoryText,
                ]}>
                  {cat}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>
        
        {/* Current Location */}
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Current Location</ThemedText>
          {isLoadingLocation ? (
            <ActivityIndicator color="#4c669f" size="small" />
          ) : (
            <ThemedView style={styles.locationContainer}>
              <FontAwesome name="map-marker" size={20} color="#4c669f" />
              <ThemedText style={styles.locationText}>{currentAddress || 'Unable to get location'}</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
        
        {/* Image Upload Section */}
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Add Photos</ThemedText>
          
          <ThemedView style={styles.imagesContainer}>
            {/* Existing images */}
            {images.map((uri, index) => (
              <ThemedView key={index} style={styles.imagePreviewContainer}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <FontAwesome name="times-circle" size={20} color="#e74c3c" />
                </TouchableOpacity>
              </ThemedView>
            ))}
            
            {/* Add image buttons */}
            {images.length < 5 && (
              <ThemedView style={styles.imageButtons}>
                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                  <FontAwesome name="image" size={20} color="#4c669f" />
                  <ThemedText style={styles.imageButtonText}>Gallery</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                  <FontAwesome name="camera" size={20} color="#4c669f" />
                  <ThemedText style={styles.imageButtonText}>Camera</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
        
        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <ThemedText style={styles.submitButtonText}>Add Location</ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
  },
  selectedCategory: {
    backgroundColor: '#4c669f',
    borderColor: '#4c669f',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  imagePreviewContainer: {
    marginRight: 10,
    marginBottom: 10,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  removeImageButton: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  imageButtons: {
    flexDirection: 'row',
  },
  imageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
  imageButtonText: {
    fontSize: 12,
    marginTop: 5,
    color: '#4c669f',
  },
  submitButton: {
    backgroundColor: '#4c669f',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#99a3bf',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddLocationScreen;
