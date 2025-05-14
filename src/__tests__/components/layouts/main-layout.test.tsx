import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import MainLayout from '@/components/layouts/main-layout';
import Sidebar from '@/components/shared/sidebar';
import type { LayoutProps } from '@/types/global';

// Mock the next/navigation hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

// Mock the Sidebar component
jest.mock('@/components/shared/sidebar', () => {
  return jest.fn(({ sidebarOpen, setSidebarOpen, pathname }) => (
    <div data-testid="sidebar" data-open={sidebarOpen} data-pathname={pathname}>
      <button 
        data-testid="sidebar-toggle-mock" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        Toggle
      </button>
    </div>
  ));
});

// Add mock for lucide-react used in MainLayout
jest.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon">Menu Icon</div>
}));

describe('MainLayout', () => {
  const mockPathname = '/dashboard';
  const mockChildren = <div data-testid="child-content">Content</div>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue(mockPathname);
    (Sidebar as jest.Mock).mockClear();
  });
  
  it('renders the layout with children', () => {
    render(<MainLayout>{mockChildren}</MainLayout>);
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
  
  it('passes the correct props to Sidebar', () => {
    render(<MainLayout>{mockChildren}</MainLayout>);
    
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-open', 'false');
    expect(sidebar).toHaveAttribute('data-pathname', mockPathname);
    
    expect(Sidebar).toHaveBeenCalled();
    const mockCall = (Sidebar as jest.Mock).mock.calls[0][0];
    expect(mockCall).toEqual(expect.objectContaining({
      sidebarOpen: false,
      setSidebarOpen: expect.any(Function),
      pathname: mockPathname
    }));
  });
  
  it('toggles sidebar visibility when menu button is clicked', () => {
    render(<MainLayout>{mockChildren}</MainLayout>);
    
    // Initially sidebar is closed
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-open', 'false');
    
    // Click menu button to open sidebar
    const menuButton = screen.getByLabelText('Open sidebar');
    fireEvent.click(menuButton);
    
    // Sidebar should be open
    expect(sidebar).toHaveAttribute('data-open', 'true');
    
    // Overlay should be visible
    const overlay = screen.getByLabelText('Close sidebar');
    expect(overlay).toBeInTheDocument();
  });
  
  it('closes sidebar when overlay is clicked', () => {
    render(<MainLayout>{mockChildren}</MainLayout>);
    
    // First open the sidebar
    const menuButton = screen.getByLabelText('Open sidebar');
    fireEvent.click(menuButton);
    
    // Sidebar should be open
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-open', 'true');
    
    // Now click the overlay to close it
    const overlay = screen.getByLabelText('Close sidebar');
    fireEvent.click(overlay);
    
    // Sidebar should be closed
    expect(sidebar).toHaveAttribute('data-open', 'false');
  });
  
  it('closes sidebar when Escape key is pressed on overlay', () => {
    render(<MainLayout>{mockChildren}</MainLayout>);
    
    // First open the sidebar
    const menuButton = screen.getByLabelText('Open sidebar');
    fireEvent.click(menuButton);
    
    // Sidebar should be open
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-open', 'true');
    
    // Press Escape key on overlay
    const overlay = screen.getByLabelText('Close sidebar');
    fireEvent.keyDown(overlay, { key: 'Escape' });
    
    // Sidebar should be closed
    expect(sidebar).toHaveAttribute('data-open', 'false');
  });
  
  it('closes sidebar when Enter key is pressed on overlay', () => {
    render(<MainLayout>{mockChildren}</MainLayout>);
    
    // First open the sidebar
    const menuButton = screen.getByLabelText('Open sidebar');
    fireEvent.click(menuButton);
    
    // Sidebar should be open
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-open', 'true');
    
    // Press Enter key on overlay
    const overlay = screen.getByLabelText('Close sidebar');
    fireEvent.keyDown(overlay, { key: 'Enter' });
    
    // Sidebar should be closed
    expect(sidebar).toHaveAttribute('data-open', 'false');
  });
  
  it('closes sidebar when Space key is pressed on overlay', () => {
    render(<MainLayout>{mockChildren}</MainLayout>);
    
    // First open the sidebar
    const menuButton = screen.getByLabelText('Open sidebar');
    fireEvent.click(menuButton);
    
    // Sidebar should be open
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-open', 'true');
    
    // Press Space key on overlay
    const overlay = screen.getByLabelText('Close sidebar');
    fireEvent.keyDown(overlay, { key: ' ' });
    
    // Sidebar should be closed
    expect(sidebar).toHaveAttribute('data-open', 'false');
  });
  
  it('allows sidebar state to be controlled from sidebar component', () => {
    render(<MainLayout>{mockChildren}</MainLayout>);
    
    // Initially sidebar is closed
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-open', 'false');
    
    // Use the mock toggle button in sidebar to trigger state change
    const sidebarToggleButton = screen.getByTestId('sidebar-toggle-mock');
    fireEvent.click(sidebarToggleButton);
    
    // Sidebar should be open now
    expect(sidebar).toHaveAttribute('data-open', 'true');
    
    // Toggle again to close
    fireEvent.click(sidebarToggleButton);
    
    // Sidebar should be closed again
    expect(sidebar).toHaveAttribute('data-open', 'false');
  });
}); 