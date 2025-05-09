import {
    GOOGLE_ANDROID_CLIENT_ID,
    GOOGLE_IOS_CLIENT_ID,
    GOOGLE_WEB_CLIENT_ID
} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

// Configure WebBrowser for redirects
WebBrowser.maybeCompleteAuthSession();

// Store keys for AsyncStorage
const USER_TOKEN_KEY = 'nomad_user_token';
const USER_INFO_KEY = 'nomad_user_info';

// Google OAuth configuration
const googleConfig = {
  expoClientId: GOOGLE_WEB_CLIENT_ID,
  androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  scopes: ['profile', 'email'],
  redirectUri: AuthSession.makeRedirectUri({
    scheme: 'nomadmap'
  })
};

// Get Google Auth Request
const useGoogleAuthRequest = () => {
  return AuthSession.useAuthRequest(
    {
      clientId: Platform.select({
        ios: googleConfig.iosClientId,
        android: googleConfig.androidClientId,
        default: googleConfig.expoClientId
      }),
      redirectUri: googleConfig.redirectUri,
      scopes: googleConfig.scopes,
      responseType: 'token',
      prompt: 'select_account',
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );
};

// Save user session data
const saveUserSession = async (userToken, userData) => {
  try {
    await AsyncStorage.setItem(USER_TOKEN_KEY, userToken);
    await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving user session:', error);
    return false;
  }
};

// Get current user session
const getUserSession = async () => {
  try {
    const userToken = await AsyncStorage.getItem(USER_TOKEN_KEY);
    const userInfo = await AsyncStorage.getItem(USER_INFO_KEY);

    if (userToken && userInfo) {
      return {
        userToken,
        userInfo: JSON.parse(userInfo)
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
};

// Sign out user
const signOut = async () => {
  try {
    await AsyncStorage.removeItem(USER_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_INFO_KEY);
    return true;
  } catch (error) {
    console.error('Error during sign out:', error);
    return false;
  }
};

// Fetch user info from Google
const fetchUserInfo = async (accessToken) => {
  try {
    const response = await fetch(
      'https://www.googleapis.com/userinfo/v2/me',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};

export {
    fetchUserInfo, getUserSession, saveUserSession, signOut, useGoogleAuthRequest
};

