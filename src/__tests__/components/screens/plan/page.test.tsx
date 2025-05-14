import React from 'react';
import { render, screen } from '@testing-library/react';
import PlanScreen from '@/components/screens/plan/page';
import { useAuthStore } from '@/stores/useAuthStore';

// Mock auth store
jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: jest.fn()
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

describe('PlanScreen Component', () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      },
      isAuthenticated: true
    });
  });

  it('renders plan screen content', () => {
    render(<PlanScreen />);
    expect(screen.getByText('Simple & Transparent Pricing')).toBeInTheDocument();
  });

  it('renders plan options', () => {
    render(<PlanScreen />);
    expect(screen.getByText('Starter')).toBeInTheDocument();
    expect(screen.getByText('Growth')).toBeInTheDocument();
    expect(screen.getByText('Agency')).toBeInTheDocument();
  });

  it('renders pricing information', () => {
    render(<PlanScreen />);
    expect(screen.getByText('$199')).toBeInTheDocument();
  });
}); 