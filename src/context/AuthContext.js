import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../lib/api'; // Adjust path as needed

// Create the authentication context
const AuthContext = createContext(null);

// Hook for using the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check local storage
        const storedUser = localStorage.getItem('userData') || sessionStorage.getItem('userData');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // Clear possibly corrupted data
        localStorage.removeItem('userData');
        sessionStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password, rememberMe) => {
    try {
      const response = await authApi.login({ email, password });
      const userData = response.data;
      
      // Store token and user data
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('userToken', userData.token);
      storage.setItem('userData', JSON.stringify(userData));
      
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear stored data
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      sessionStorage.removeItem('userToken');
      sessionStorage.removeItem('userData');
      
      // Update state
      setCurrentUser(null);
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Value to provide through the context
  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;