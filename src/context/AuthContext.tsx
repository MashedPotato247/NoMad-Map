import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { UserInfo, getCurrentUser, signInWithGoogle, signOutUser, useGoogleAuth } from '../services/auth';

// Define auth context type
interface AuthContextType {
  user: UserInfo | null;
  isLoading: boolean;
  signIn: () => Promise<UserInfo | null>;
  signOut: () => Promise<void>;
  initialized: boolean;
}

// Create context with proper type
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State for user and loading
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  
  // Get Google auth hooks
  const { request, response, promptAsync } = useGoogleAuth();

  // Handle Google sign-in response
  useEffect(() => {
    const handleSignInResponse = async () => {
      if (response?.type === 'success') {
        setIsLoading(true);
        const { accessToken } = response.authentication || {};
        
        if (accessToken) {
          // Sign in with Google and get user info
          const user = await signInWithGoogle(accessToken);
          
          if (user) {
            // Save user to state and storage
            setUser(user);
            await AsyncStorage.setItem('user', JSON.stringify(user));
          }
        }
        
        setIsLoading(false);
      }
    };
    
    handleSignInResponse();
  }, [response]);

  // Check for existing user on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check AsyncStorage first
        const storedUser = await AsyncStorage.getItem('user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Check Firebase auth
          const currentUser = getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            await AsyncStorage.setItem('user', JSON.stringify(currentUser));
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };
    
    initAuth();
  }, []);

  // Sign in function
  const signIn = async (): Promise<UserInfo | null> => {
    try {
      setIsLoading(true);
      
      if (!request) {
        throw new Error('Google Auth request not available');
      }
      
      // Prompt for Google sign-in
      await promptAsync();
      
      // The result will be handled in the useEffect above
      return user;
    } catch (error) {
      console.error('Error signing in:', error);
      setIsLoading(false);
      return null;
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Sign out from Firebase
      await signOutUser();
      
      // Clear stored user
      await AsyncStorage.removeItem('user');
      
      // Update state
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signOut,
    initialized,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
