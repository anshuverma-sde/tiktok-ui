'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLogout } from '@/lib/api/mutations/auth';
import {
  Home,
  Users,
  ShoppingBag,
  BarChart2,
  Settings,
  X,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import logo from '../../../public/images/logo.png';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  pathname: string;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, pathname }) => {
  const [openAnalytics, setOpenAnalytics] = useState(true);
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();

  const handleLogout = () => logout();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Creators', href: '/creators', icon: Users },
    { name: 'Products', href: '/products', icon: ShoppingBag },
    {
      name: 'Analytics',
      icon: BarChart2,
      children: [
        { name: 'Sales Dashboard', href: '/analytics/sales' },
        { name: 'Creator Analysis', href: '/analytics/creators' },
      ],
    },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image src={logo} alt="Logo" width={150} height={40} className="h-8 w-auto" priority />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-2 text-gray-500 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (item.children) {
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => setOpenAnalytics(!openAnalytics)}
                    className={cn(
                      'group flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition',
                      openAnalytics ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-700 hover:bg-gray-100 hover:font-semibold'
                    )}
                  >
                    <span className="flex items-center">
                      <Icon className="mr-3 h-5 w-5 text-gray-500" />
                      {item.name}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        openAnalytics ? 'rotate-180' : 'rotate-0'
                      )}
                    />
                  </button>
                  {openAnalytics && (
                    <div className="ml-6 space-y-1">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={cn(
                            'block rounded-md px-3 py-1.5 text-sm transition',
                            pathname === sub.href
                              ? 'bg-gray-200 text-gray-900 font-semibold'
                              : 'text-gray-600 hover:bg-gray-100 hover:font-semibold'
                          )}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm transition',
                  isActive
                    ? 'bg-gray-200 text-gray-900 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 hover:font-semibold'
                )}
              >
                <Icon
                  className={cn(
                    'mr-3 h-5 w-5 transition',
                    isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                <User size={16} className="text-gray-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-700">{user?.name ?? 'User'}</p>
                <p className="text-xs text-gray-500 truncate max-w-[160px]">{user?.email ?? 'user@example.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;