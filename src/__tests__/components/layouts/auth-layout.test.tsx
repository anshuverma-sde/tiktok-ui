import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthLayout from '@/components/layouts/auth-layout';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Convert boolean priority to string
    const imgProps = {
      ...props,
    };
    if (props.priority === true) {
      imgProps.priority = 'true';
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...imgProps} alt={props.alt || ''} />;
  },
}));

// Mock next/link
jest.mock('next/link', () =>
  // eslint-disable-next-line react/display-name
  ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
);

describe('AuthLayout Component', () => {
  const defaultProps = {
    title: 'Test Title',
    children: <div>Test Content</div>,
  };

  it('renders auth layout with required props', () => {
    render(<AuthLayout {...defaultProps} />);

    // Check for logo
    expect(screen.getByAltText('Brand Logo')).toBeInTheDocument();

    // Check for title
    expect(screen.getByText('Test Title')).toBeInTheDocument();

    // Check for children content
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with optional description', () => {
    render(<AuthLayout {...defaultProps} description="Test Description" />);

    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders with footer content', () => {
    render(
      <AuthLayout {...defaultProps} footerContent={<div>Footer Content</div>} />
    );

    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('renders support link', () => {
    render(<AuthLayout {...defaultProps} />);

    expect(screen.getByText('Need help?')).toBeInTheDocument();
    expect(screen.getByText('Contact support')).toBeInTheDocument();
  });
});
