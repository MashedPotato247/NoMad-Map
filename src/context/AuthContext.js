import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchUserInfo, getUserSession, saveUserSession, signOut, useGoogleAuthRequest } from '../services/auth';
import { createUser, getUserByEmail } from '../services/firestore';

// Create context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get Google authentication request
  const [request, response, promptAsync] = useGoogleAuthRequest();

  // Check for existing session on mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const session = await getUserSession();
        if (session) {
          setUser(session.userInfo);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserSession();
  }, []);

  // Handle Google Auth response
  useEffect(() => {
    const handleAuthResponse = async () => {
      if (response?.type === 'success') {
        setLoading(true);
        const { access_token } = response.params;
        
        // Get user info from Google
        const userInfo = await fetchUserInfo(access_token);
        
        if (userInfo) {
          // Check if user exists in our database
          let firestoreUser = await getUserByEmail(userInfo.email);
          
          // If user doesn't exist, create a new one
          if (!firestoreUser) {
            const userId = await createUser({
              email: userInfo.email,
              displayName: userInfo.name,
              photoURL: userInfo.picture,
              googleId: userInfo.id,
            });
            
            firestoreUser = {
              id: userId,
              email: userInfo.email,
              displayName: userInfo.name,
              photoURL: userInfo.picture,
              googleId: userInfo.id,
            };
          }
          
          // Save user session
          await saveUserSession(access_token, {
            ...firestoreUser,
            googleUser: userInfo,
          });
          
          // Set user state
          setUser({
            ...firestoreUser,
            googleUser: userInfo,
          });
        }
        
        setLoading(false);
      } else if (response?.type === 'error') {
        console.error('Authentication error:', response.error);
        setLoading(false);
      }
    };
    
    if (response) {
      handleAuthResponse();
    }
  }, [response]);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      return await promptAsync();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      return null;
    }
  };

  // Sign out
  const handleSignOut = async () => {
    setLoading(true);
    const success = await signOut();
    if (success) {
      setUser(null);
    }
    setLoading(false);
    return success;
  };

  // Context value
  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
