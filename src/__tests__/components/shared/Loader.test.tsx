import React from 'react';
import { render, screen } from '@testing-library/react';
import { Loader } from '@/components/shared/Loader';
import { useLoaderStore } from '@/stores/useLoaderStore';

// Mock the store
jest.mock('@/stores/useLoaderStore', () => ({
  useLoaderStore: jest.fn()
}));

describe('Loader Component', () => {
  it('renders loader when loading is true', () => {
    (useLoaderStore as unknown as jest.Mock).mockReturnValue({
      isLoading: true,
      message: 'Loading...'
    });

    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('does not render when loading is false', () => {
    // Mock store values
    (useLoaderStore as unknown as jest.Mock).mockReturnValue({
      isLoading: false,
      message: ''
    });

    const { container } = render(<Loader />);
    expect(container).toBeEmptyDOMElement();
  });
}); 