import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '@/app/(root)/layout';
import MainLayout from '@/components/layouts/main-layout';
import { AuthProvider } from '@/context/AuthContext';

// Mock the dependencies
jest.mock('@/components/layouts/main-layout', () => {
  return jest.fn(({ children }) => <div data-testid="main-layout">{children}</div>);
});

jest.mock('@/context/AuthContext', () => ({
  AuthProvider: jest.fn(({ children }) => <div data-testid="auth-provider">{children}</div>),
}));

jest.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: jest.fn(() => <div data-testid="react-query-devtools" />),
}));

describe('Root Layout', () => {
  it('renders the layout with main layout and auth provider', () => {
    render(
      <Layout>
        <div data-testid="child-content">Test Content</div>
      </Layout>
    );

    // Check that the child content is rendered
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    
    // Check that the main layout and auth provider components are used
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    
    // Check that react query devtools is rendered
    expect(screen.getByTestId('react-query-devtools')).toBeInTheDocument();
    
    // Check that the components are used with the correct props/structure
    expect(AuthProvider).toHaveBeenCalled();
    expect(MainLayout).toHaveBeenCalled();
  });
}); 