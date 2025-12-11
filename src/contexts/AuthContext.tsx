import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, type User } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
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
      await refreshUser();
      toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast({ title: 'Login failed', description: message, variant: 'destructive' });
      throw error;
    }
  };

  const signup = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      await authApi.signup({ email, password, first_name: firstName, last_name: lastName });
      await refreshUser();
      toast({ title: 'Account created!', description: 'Welcome to Zest Comply.' });
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
        isAuthenticated: !!user,
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
