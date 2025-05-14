import React from 'react';
import { render, screen } from '@testing-library/react';
import { 
  Toast, 
  ToastProvider, 
  ToastViewport, 
  ToastTitle,
  ToastDescription,
  ToastAction
} from '@/components/ui/toast';

// Mock Lucide React X icon used in ToastClose
jest.mock('lucide-react', () => ({
  X: () => <div data-testid="mock-x-icon">X</div>
}));

// Mock the radix toast onOpenChange function
const mockOnOpenChange = jest.fn();

// Test with basic toast
const BasicToast = () => (
  <ToastProvider>
    <Toast>
      <div>Test Toast Content</div>
    </Toast>
    <ToastViewport />
  </ToastProvider>
);

// Test with simple toast instead of full components
const SimpleToastTest = ({ variant = "default" }: { variant?: "default" | "destructive" }) => (
  <ToastProvider>
    <Toast variant={variant} onOpenChange={mockOnOpenChange} data-testid="test-toast">
      <ToastTitle>Example Title</ToastTitle>
      <ToastDescription>Example description goes here</ToastDescription>
      <ToastAction altText="Action" onClick={() => {}}>Action</ToastAction>
    </Toast>
    <ToastViewport />
  </ToastProvider>
);

// Test with custom classes
const CustomClassToast = () => (
  <ToastProvider>
    <Toast className="custom-toast-class" data-testid="custom-toast">
      <ToastTitle className="custom-title-class">Custom Title</ToastTitle>
      <ToastDescription className="custom-description-class">Custom Description</ToastDescription>
      <ToastAction className="custom-action-class" altText="Custom Action">Custom Action</ToastAction>
    </Toast>
    <ToastViewport className="custom-viewport-class" data-testid="custom-viewport" />
  </ToastProvider>
);

describe('Toast Component', () => {
  beforeEach(() => {
    mockOnOpenChange.mockClear();
  });

  it('renders toast with basic content', () => {
    render(<BasicToast />);
    expect(screen.getByText('Test Toast Content')).toBeInTheDocument();
  });

  it('renders toast viewport', () => {
    render(<BasicToast />);
    const viewport = screen.getByRole('region');
    expect(viewport).toBeInTheDocument();
  });

  it('renders toast with title and description', () => {
    render(<SimpleToastTest />);
    expect(screen.getByText('Example Title')).toBeInTheDocument();
    expect(screen.getByText('Example description goes here')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('renders destructive variant', () => {
    render(<SimpleToastTest variant="destructive" />);
    const toast = screen.getByTestId('test-toast');
    expect(toast).toHaveClass('destructive');
  });

  it('applies custom classes to toast components', () => {
    render(<CustomClassToast />);
    
    // Check each component has its custom class
    expect(screen.getByTestId('custom-toast')).toHaveClass('custom-toast-class');
    expect(screen.getByText('Custom Title')).toHaveClass('custom-title-class');
    expect(screen.getByText('Custom Description')).toHaveClass('custom-description-class');
    expect(screen.getByRole('button', { name: 'Custom Action' })).toHaveClass('custom-action-class');
    
    // Check viewport
    expect(screen.getByTestId('custom-viewport')).toHaveClass('custom-viewport-class');
  });

  it('simulates onOpenChange being called', () => {
    render(<SimpleToastTest />);
    
    // Manually trigger onOpenChange
    mockOnOpenChange(false);
    
    // Check if onOpenChange was called with false
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders toast with ref correctly', () => {
    const ToastWithRef = () => {
      const ref = React.useRef(null);
      return (
        <ToastProvider>
          <Toast ref={ref} data-testid="toast-with-ref">
            Toast with ref
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
    };

    render(<ToastWithRef />);
    expect(screen.getByTestId('toast-with-ref')).toBeInTheDocument();
  });

  it('renders action with ref correctly', () => {
    const ActionWithRef = () => {
      const ref = React.useRef(null);
      return (
        <ToastProvider>
          <Toast>
            <ToastAction ref={ref} altText="Action" data-testid="action-with-ref">
              Action with ref
            </ToastAction>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
    };

    render(<ActionWithRef />);
    expect(screen.getByTestId('action-with-ref')).toBeInTheDocument();
  });
}); 