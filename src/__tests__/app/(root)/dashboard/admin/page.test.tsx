import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminDashboardPage from '@/app/(root)/dashboard/admin/page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Admin Dashboard Page', () => {
  it('renders the admin dashboard page', () => {
    render(<AdminDashboardPage />);
    
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders a link to the profile page', () => {
    render(<AdminDashboardPage />);
    
    const profileLink = screen.getByText('profile');
    expect(profileLink).toBeInTheDocument();
    expect(profileLink.closest('a')).toHaveAttribute('href', '/profile');
  });
}); 