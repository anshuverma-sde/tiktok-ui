'use client';

import { useProfileQuery } from '@/lib/api/queries/user';
import { useAuthStore } from '@/stores/useAuthStore';
import { IUser } from '@/types/user';
import React, { createContext, useContext, useEffect, useMemo } from 'react';

type AuthContextType = {
  user?: IUser;
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, error, isLoading, isFetching, refetch, isSuccess } =
    useProfileQuery();
  const setUser = useAuthStore((state) => state.setUser);

  const user = data?.data;

  useEffect(() => {
    if (isSuccess && user) {
      setUser({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
        companyName: user.companyName,
      });
    }
  }, [isSuccess, user, setUser]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ user, error, isLoading, isFetching, refetch }),
    [user, error, isLoading, isFetching, refetch]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

