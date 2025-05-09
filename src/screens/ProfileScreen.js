import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  const profileData = {
    postsCount: 12,
    following: 45,
    followers: 78,
  };
  
  if (!user) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading profile...</ThemedText>
      </ThemedView>
    );
  }
  
  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      {/* Profile Header */}
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.headerContainer}
      >
        <Image
          source={{ uri: user.photoURL || user.googleUser?.picture }}
          style={styles.profileImage}
        />
        
        <ThemedText style={styles.profileName}>
          {user.displayName || user.googleUser?.name || 'Nomad Explorer'}
        </ThemedText>
        
        <ThemedText style={styles.profileBio}>
          Travel enthusiast | Explorer | Photographer
        </ThemedText>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>{profileData.postsCount}</ThemedText>
            <ThemedText style={styles.statLabel}>Posts</ThemedText>
          </View>
          
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>{profileData.following}</ThemedText>
            <ThemedText style={styles.statLabel}>Following</ThemedText>
          </View>
          
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>{profileData.followers}</ThemedText>
            <ThemedText style={styles.statLabel}>Followers</ThemedText>
          </View>
        </View>
      </LinearGradient>
      
      {/* Profile Content */}
      <ThemedView style={styles.contentContainer}>
        {/* Settings Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Settings</ThemedText>
          
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="user-o" size={20} color={textColor} />
            <ThemedText style={styles.settingText}>Edit Profile</ThemedText>
            <FontAwesome name="chevron-right" size={16} color={textColor} style={styles.settingIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="bell-o" size={20} color={textColor} />
            <ThemedText style={styles.settingText}>Notifications</ThemedText>
            <FontAwesome name="chevron-right" size={16} color={textColor} style={styles.settingIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="lock" size={20} color={textColor} />
            <ThemedText style={styles.settingText}>Privacy</ThemedText>
            <FontAwesome name="chevron-right" size={16} color={textColor} style={styles.settingIcon} />
          </TouchableOpacity>
        </ThemedView>
        
        {/* About Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>About</ThemedText>
          
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="info-circle" size={20} color={textColor} />
            <ThemedText style={styles.settingText}>Help Center</ThemedText>
            <FontAwesome name="chevron-right" size={16} color={textColor} style={styles.settingIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="star-o" size={20} color={textColor} />
            <ThemedText style={styles.settingText}>Rate App</ThemedText>
            <FontAwesome name="chevron-right" size={16} color={textColor} style={styles.settingIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="file-text-o" size={20} color={textColor} />
            <ThemedText style={styles.settingText}>Terms & Policies</ThemedText>
            <FontAwesome name="chevron-right" size={16} color={textColor} style={styles.settingIcon} />
          </TouchableOpacity>
        </ThemedView>
        
        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
        </TouchableOpacity>
        
        <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
    marginBottom: 15,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  profileBio: {
    color: 'white',
    opacity: 0.8,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    color: 'white',
    opacity: 0.8,
    fontSize: 12,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150,150,150,0.2)',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  settingIcon: {
    opacity: 0.5,
  },
  signOutButton: {
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#e74c3c',
    marginTop: 10,
    marginBottom: 20,
  },
  signOutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    opacity: 0.5,
    fontSize: 12,
  },
});

export default ProfileScreen;
