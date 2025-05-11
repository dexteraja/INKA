import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGoogle, loginWithEmailPassword, createUser, updateUserProfile, logoutUser, isNewUser, resetNewUserFlag } from "../lib/firebase";
import type { User } from "@shared/schema";
import { apiRequest } from "../lib/queryClient";

// Define user profile structure
interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
  createdAt: Date;
  isNewUser?: boolean;
}

// Define auth context properties
interface AuthContextProps {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  updateProfile: (displayName: string, photoURL?: string) => Promise<void>;
  syncUserWithBackend: (userData: Partial<User>) => Promise<User>;
  logout: () => Promise<void>;
  showWelcomeMessage: boolean;
  setShowWelcomeMessage: (value: boolean) => void;
}

// List of admin emails
const ADMIN_EMAILS = ['admin@virtualrail.com', 'alexander@virtualrail.com'];

// Create auth context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState<boolean>(false);

  // Check if user is authenticated
  const isAuthenticated = !!user;
  
  // Check if user is admin
  const isAdmin = isAuthenticated && !!user?.email && ADMIN_EMAILS.includes(user.email);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        // Check if user is new
        const isUserNew = isNewUser();
        if (isUserNew) {
          setShowWelcomeMessage(true);
          resetNewUserFlag();
        }
        
        // Create user profile object
        const userProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isAdmin: firebaseUser.email ? ADMIN_EMAILS.includes(firebaseUser.email) : false,
          createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
          isNewUser: isUserNew
        };
        
        // Save user in state
        setFirebaseUser(firebaseUser);
        setUser(userProfile);
        
        // Try to sync with backend
        try {
          const userData: Partial<User> = {
            username: userProfile.displayName || userProfile.email?.split('@')[0] || 'user',
            email: userProfile.email || '',
            role: userProfile.isAdmin ? 'admin' : 'candidate',
            firstName: userProfile.displayName?.split(' ')[0] || null,
            lastName: userProfile.displayName?.split(' ').slice(1).join(' ') || null,
            profileImageUrl: userProfile.photoURL
          };
          
          await syncUserWithBackend(userData);
        } catch (error) {
          console.error("Failed to sync user with backend", error);
        }
      } else {
        // Reset state if no user
        setFirebaseUser(null);
        setUser(null);
      }
      
      setIsLoading(false);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Login with Google
  const loginWithGoogleHandler = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Error logging in with Google", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with email and password
  const loginWithEmailHandler = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await loginWithEmailPassword(email, password);
    } catch (error) {
      console.error("Error logging in with email", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register with email and password
  const registerWithEmailHandler = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await createUser(email, password);
      // Set flag to show welcome message
      localStorage.setItem("newUser", "true");
    } catch (error) {
      console.error("Error registering with email", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfileHandler = async (displayName: string, photoURL?: string) => {
    try {
      setIsLoading(true);
      await updateUserProfile(displayName, photoURL);
      
      // Update local user state
      if (firebaseUser) {
        const updatedFirebaseUser = { ...firebaseUser };
        if (user) {
          setUser({
            ...user,
            displayName,
            photoURL: photoURL || user.photoURL
          });
        }
      }
    } catch (error) {
      console.error("Error updating profile", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sync user with backend
  const syncUserWithBackend = async (userData: Partial<User>): Promise<User> => {
    try {
      // First check if user exists
      const existingUserResponse = await apiRequest(`/api/users/email/${userData.email}`);
      
      if (existingUserResponse.ok) {
        const existingUserData = await existingUserResponse.json();
        if (existingUserData.success && existingUserData.data) {
          return existingUserData.data;
        }
      }
      
      // If user doesn't exist, create new user
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: userData.username || userData.email?.split('@')[0] || 'user',
          email: userData.email || '',
          password: Math.random().toString(36).slice(2, 10), // Random password for OAuth users
          role: userData.isAdmin ? 'admin' : 'candidate',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          profileImageUrl: user?.photoURL || null
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync user with backend');
      }
      
      const responseData = await response.json();
      if (responseData.success && responseData.data) {
        return responseData.data;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error syncing user with backend:', error);
      throw error;
    }
  };

  // Logout
  const logoutHandler = async () => {
    try {
      setIsLoading(true);
      await logoutUser();
    } catch (error) {
      console.error("Error logging out", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated,
    isAdmin,
    loginWithGoogle: loginWithGoogleHandler,
    loginWithEmail: loginWithEmailHandler,
    registerWithEmail: registerWithEmailHandler,
    updateProfile: updateProfileHandler,
    syncUserWithBackend,
    logout: logoutHandler,
    showWelcomeMessage,
    setShowWelcomeMessage
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};