import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfilePage from '@/app/(root)/profile/page';
import { useAuthStore } from '@/stores/useAuthStore';

// Mock the auth store
jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Profile Page', () => {
  beforeEach(() => {
    // Setup mock user data
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = {
        user: {
          _id: '123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
        },
      };
      return selector(store);
    });
  });

  it('renders the profile page with user data', () => {
    render(<ProfilePage />);
    
    expect(screen.getByText(/Profile/)).toBeInTheDocument();
    expect(screen.getByText(/Test User/)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
  });

  it('renders links to dashboard and home', () => {
    render(<ProfilePage />);
    
    const dashboardLink = screen.getByText('dashboard');
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink.closest('a')).toHaveAttribute('href', '/dashboard/admin');
    
    const homeLink = screen.getByText('home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });
}); 