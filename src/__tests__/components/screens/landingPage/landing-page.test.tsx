import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingPage from '@/components/screens/landingPage/landing-page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

// Mock next/link
jest.mock('next/link', () => {
  return function Link({ children, href, ...props }: any) {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, { href, ...props });
    }
    return <span data-href={href} {...props}>{children}</span>;
  };
});

describe('LandingPage Component', () => {
  it('renders landing page content', () => {
    render(<LandingPage />);
    expect(screen.getByText('TikTok Shop Creator Management')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<LandingPage />);
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Plan')).toBeInTheDocument();
  });

  it('renders call to action buttons', () => {
    render(<LandingPage />);
    const getStartedButton = screen.getByRole('button', { name: 'Get Started' });
    const loginButton = screen.getByRole('button', { name: 'Login' });
    expect(getStartedButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });
}); 