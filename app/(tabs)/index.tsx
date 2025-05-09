import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useThemeColor } from '@/hooks/useThemeColor';
import MapComponent from '@/src/components/map/MapComponent';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocation, LocationData } from '@/src/context/LocationContext';
import { FontAwesome } from '@expo/vector-icons';

export default function MapScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedLocation } = useLocation();
  
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');

  const handleMarkerPress = (location: LocationData) => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Map Component */}
      <MapComponent onMarkerPress={handleMarkerPress} />
      
      {/* Location Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={(e) => e.stopPropagation()}
            style={[styles.modalContainer, { backgroundColor }]}
          >
            <View style={styles.modalHeader}>
              <ThemedText type="title" style={styles.modalTitle}>
                {selectedLocation?.name || 'Location Details'}
              </ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <ThemedText>{selectedLocation?.description || 'No description available.'}</ThemedText>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                  <FontAwesome name="heart-o" size={20} color={textColor} />
                  <ThemedText style={styles.actionText}>Save</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <FontAwesome name="comment-o" size={20} color={textColor} />
                  <ThemedText style={styles.actionText}>Comment</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <FontAwesome name="share" size={20} color={textColor} />
                  <ThemedText style={styles.actionText}>Share</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    minHeight: '40%',
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingVertical: 10,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
  },
});
});
