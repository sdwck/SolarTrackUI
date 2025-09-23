import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import authService from '../services/authService';
import { type User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credential: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credential: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.login({ credential, password });
      setUser(response.user);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'An unexpected error occurred';

      if (error.response?.status === 401) {
        errorMessage = 'Invalid credential or password';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};