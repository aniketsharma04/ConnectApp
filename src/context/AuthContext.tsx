import { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '@/types';
import { getCurrentUser } from '@/lib/appwrite/api'; // Ensure the correct path to getCurrentUser
import { useNavigate } from 'react-router-dom';

// Default user state
export const INITIAL_USER: IUser = {
  accountId: '',
  name: '',
  username: '',
  email: '',
  imageUrl: '',
  bio: '',
};

// Initial state for context
const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
};

const AuthContext = createContext(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Function to check if the user is authenticated
  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) throw new Error('User is not authenticated');
  
      setUser({
        accountId: currentUser.accountId, // Ensure this is correctly set
        name: currentUser.name,
        username: currentUser.username,
        email: currentUser.email,
        imageUrl: currentUser.imageUrl,
        bio: currentUser.bio,
      });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    if (localStorage.getItem('cookieFallback') === '[]') {
      navigate('/sign-in');
    } else {
      checkAuthUser();
    }
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

// Custom hook to use context
export const useUserContext = () => useContext(AuthContext);
