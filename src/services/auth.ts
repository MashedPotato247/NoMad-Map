import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
    GoogleAuthProvider,
    signInWithCredential,
    signOut,
    User,
    UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';

// Register for the authentication callback
WebBrowser.maybeCompleteAuthSession();

// Define types for our auth methods
export interface UserInfo {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

// Google Sign-In Configuration
const googleConfig = {
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID,
  expoClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_EXPO_CLIENT_ID,
};

// Initialize Google Auth
export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest(googleConfig);
  
  return {
    request,
    response,
    promptAsync,
  };
};

// Sign in with Google
export const signInWithGoogle = async (
  accessToken: string
): Promise<UserInfo | null> => {
  try {
    // Create a Google credential with the token
    const credential = GoogleAuthProvider.credential(null, accessToken);
    
    // Sign in with the credential
    const userCredential: UserCredential = await signInWithCredential(
      auth,
      credential
    );
    
    // Extract user information
    const { user } = userCredential;
    return getUserInfo(user);
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return null;
  }
};

// Sign out
export const signOutUser = async (): Promise<boolean> => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
};

// Get current user
export const getCurrentUser = (): UserInfo | null => {
  const user = auth.currentUser;
  return user ? getUserInfo(user) : null;
};

// Helper function to convert Firebase User to UserInfo
const getUserInfo = (user: User): UserInfo => {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };
};
