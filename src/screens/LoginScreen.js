import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import logo from '../assets/logo';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  // Redirect to home if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.replace('/(tabs)');
    }
  }, [user, loading, router]);

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* App Logo */}
        <Image
          source={{ uri: logo.uri }}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>NomadMap</Text>
        
        <Text style={styles.subtitle}>
          Connect with travelers, share experiences, and discover new places
        </Text>
        
        {/* Google Sign In Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
        >
          <FontAwesome name="google" size={20} color="#192f6a" />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  googleButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#192f6a',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  footerText: {
    color: 'white',
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 12,
  },
});

export default LoginScreen;
