import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  companyName?: string;
  picture?: string;
  accessToken?: string;
  refreshToken?: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  setUser: (userData: User) => void;
  logout: () => void;
  setRole: (role: 'brand_owner' | 'admin') => void;
};

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,

    login: (userData) => {
      set((state) => {
        state.user = userData;
        state.isAuthenticated = true;
      });
    },

    logout: () => {
      set((state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
    },

    setUser: (userData) => {
      set((state) => {
        state.user = { ...state.user, ...userData };
      });
    },

    setRole: (role) => {
      set((state) => {
        if (state.user) {
          state.user.role = role;
        }
      });
    },
  }))
);
