'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { UserProfile } from '@/lib/types';

// ============================================
// APP CONTEXT
// Global state management with React Context
// ============================================

interface AppState {
  user: UserProfile | null;
  isLoading: boolean;
  // Add more global state as needed
}

interface AppContextValue extends AppState {
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  setLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
  initialUser?: UserProfile | null;
}

export function AppProvider({ children, initialUser = null }: AppProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(initialUser);
  const [isLoading, setLoading] = useState(false);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const value: AppContextValue = {
    user,
    isLoading,
    setUser,
    updateUser,
    setLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Convenience hooks for specific state slices
export function useUser() {
  const { user, setUser, updateUser } = useAppContext();
  return { user, setUser, updateUser };
}

export function useLoading() {
  const { isLoading, setLoading } = useAppContext();
  return { isLoading, setLoading };
}
