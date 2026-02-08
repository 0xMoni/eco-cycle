import { create } from 'zustand';
import { User } from '@/types';
import { storageService } from '@/lib/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });

    try {
      const user = storageService.getUserByEmail(email);

      if (user) {
        storageService.setCurrentUser(user);
        set({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      } else {
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  register: async (email: string, password: string, username: string) => {
    set({ isLoading: true });
    
    try {
      // Check if user already exists
      const existingUser = storageService.getUserByEmail(email);
      if (existingUser) {
        set({ isLoading: false });
        return false;
      }

      const user = storageService.createUser({
        email,
        username,
      });
      
      storageService.setCurrentUser(user);
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return true;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  logout: () => {
    storageService.setCurrentUser(null);
    set({ 
      user: null, 
      isAuthenticated: false 
    });
  },

  updateProfile: async (updates: Partial<User>) => {
    const { user } = get();
    if (!user) return false;

    try {
      const updatedUser = storageService.updateUser(user.id, updates);
      if (updatedUser) {
        storageService.setCurrentUser(updatedUser);
        set({ user: updatedUser });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  initializeAuth: () => {
    storageService.loadFromLocalStorage();
    const currentUser = storageService.getCurrentUser();
    set({
      user: currentUser,
      isAuthenticated: !!currentUser
    });
  },
}));
