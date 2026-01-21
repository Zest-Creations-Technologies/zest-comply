// Authentication context for managing user sessions
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, type User, type SignupResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<SignupResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      if (authApi.isAuthenticated()) {
        await refreshUser();
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen for logout events from API client
    const handleLogout = () => {
      setUser(null);
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [refreshUser]);

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    try {
      await authApi.login({ email, password, remember_me: rememberMe });
      // Try to fetch user, but don't fail the login if it doesn't work
      try {
        await refreshUser();
      } catch {
        // If user fetch fails, we still consider login successful
        console.warn('Could not fetch user details after login');
      }
      toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      
      // Check if it's an email not verified error
      if (message.toLowerCase().includes('email not verified') || 
          message.toLowerCase().includes('verify your email')) {
        // Don't show toast here - let the login page handle the redirect
        throw error;
      }
      
      toast({ title: 'Login failed', description: message, variant: 'destructive' });
      throw error;
    }
  };

  // Signup now returns user profile (no auto-login - requires email verification)
  const signup = async (email: string, password: string, firstName?: string, lastName?: string): Promise<SignupResponse> => {
    try {
      const response = await authApi.signup({ email, password, first_name: firstName, last_name: lastName });
      // Don't auto-login - user needs to verify email first
      toast({ 
        title: 'Account created!', 
        description: 'Please check your email for the verification code.' 
      });
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      toast({ title: 'Signup failed', description: message, variant: 'destructive' });
      throw error;
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    toast({ title: 'Logged out', description: 'See you next time!' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user || authApi.isAuthenticated(),
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // During initial render or HMR, context might not be available yet
    // Return a safe default instead of throwing
    return {
      user: null,
      isLoading: true,
      isAuthenticated: false,
      login: async () => { throw new Error('Auth not initialized'); },
      signup: async (): Promise<SignupResponse> => { throw new Error('Auth not initialized'); },
      logout: async () => { throw new Error('Auth not initialized'); },
      refreshUser: async () => { throw new Error('Auth not initialized'); },
    };
  }
  return context;
}
