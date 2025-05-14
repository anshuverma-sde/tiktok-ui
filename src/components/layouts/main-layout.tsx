'use client';

import { LayoutProps } from '@/types/global';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import Sidebar from '../shared/sidebar';


const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleOverlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden border-0 cursor-pointer w-full"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={handleOverlayKeyDown}
          aria-label="Close sidebar"
        />
      )}

      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        pathname={pathname}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-12">
          <div className="flex h-full items-center px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded p-1 text-gray-500 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="ml-auto flex items-center"></div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;