import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from '../../../components/shared/sidebar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock next/link
jest.mock('next/link', () =>
  // eslint-disable-next-line react/display-name
  ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
);

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Remove priority prop to avoid warning
    const { ...imgProps } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...imgProps} alt={props.alt || ''} />;
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Home: () => <span data-testid="home-icon" />,
  Users: () => <span data-testid="users-icon" />,
  ShoppingBag: () => <span data-testid="shopping-icon" />,
  BarChart2: () => <span data-testid="chart-icon" />,
  Settings: () => <span data-testid="settings-icon" />,
  X: () => <span data-testid="close-icon" />,
  LogOut: () => <span data-testid="logout-icon" />,
  User: () => <span data-testid="user-icon" />,
  ChevronDown: () => <span data-testid="chevron-icon" />,
}));

// Mock auth store with static data
jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: jest.fn(() => ({
    user: {
      name: 'User',
      email: 'user@example.com',
    },
  })),
}));

// Mock logout mutation
jest.mock('@/lib/api/mutations/auth', () => ({
  useLogout: () => ({
    mutate: jest.fn(),
  }),
}));

describe('Sidebar Component', () => {
  const defaultProps = {
    sidebarOpen: true,
    setSidebarOpen: jest.fn(),
    pathname: '/dashboard',
  };

  it('renders sidebar with navigation items', () => {
    render(<Sidebar {...defaultProps} />);

    // Check for main navigation items using data-testid
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    expect(screen.getByTestId('shopping-icon')).toBeInTheDocument();
    expect(screen.getByTestId('chart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
  });

  it('renders user section with user info', () => {
    render(<Sidebar {...defaultProps} />);

    // Check for user section elements using static data
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Sidebar {...defaultProps} />);

    // Check for navigation links using more specific selectors
    const mainNavLinks = screen.getAllByRole('link');
    const dashboardLink = mainNavLinks.find(
      (link) =>
        link.textContent === 'Dashboard' &&
        link.querySelector('[data-testid="home-icon"]')
    );
    const creatorsLink = mainNavLinks.find(
      (link) =>
        link.textContent === 'Creators' &&
        link.querySelector('[data-testid="users-icon"]')
    );
    const productsLink = mainNavLinks.find(
      (link) =>
        link.textContent === 'Products' &&
        link.querySelector('[data-testid="shopping-icon"]')
    );
    const settingsLink = mainNavLinks.find(
      (link) =>
        link.textContent === 'Settings' &&
        link.querySelector('[data-testid="settings-icon"]')
    );

    expect(dashboardLink).toBeInTheDocument();
    expect(creatorsLink).toBeInTheDocument();
    expect(productsLink).toBeInTheDocument();
    expect(settingsLink).toBeInTheDocument();
  });

  it('renders analytics section', () => {
    render(<Sidebar {...defaultProps} />);

    // Check for analytics section
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /analytics/i })
    ).toBeInTheDocument();
  });
});
