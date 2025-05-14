import MainLayout from '@/components/layouts/main-layout';
import { AuthProvider } from '@/context/AuthContext';
import { LayoutProps } from '@/types/global';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <AuthProvider>
        <MainLayout>{children}</MainLayout>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};

export default Layout;
