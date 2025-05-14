import React from 'react';
import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

describe('Alert Component', () => {
  it('renders alert with basic content', () => {
    render(
      <Alert>
        <AlertTitle>Test Title</AlertTitle>
        <AlertDescription>Test Description</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders destructive alert', () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong</AlertDescription>
      </Alert>
    );
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-red-500/50');
  });
  
  it('applies custom className to Alert component', () => {
    const customClass = 'custom-alert';
    render(
      <Alert className={customClass}>
        <AlertTitle>Title</AlertTitle>
      </Alert>
    );
    
    expect(screen.getByRole('alert')).toHaveClass(customClass);
  });
  
  it('applies custom className to AlertTitle', () => {
    const customClass = 'custom-title';
    render(
      <Alert>
        <AlertTitle className={customClass}>Custom Title</AlertTitle>
      </Alert>
    );
    
    expect(screen.getByText('Custom Title')).toHaveClass(customClass);
  });
  
  it('applies custom className to AlertDescription', () => {
    const customClass = 'custom-description';
    render(
      <Alert>
        <AlertDescription className={customClass}>Custom Description</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Custom Description')).toHaveClass(customClass);
  });
  
  it('renders default variant when not specified', () => {
    render(
      <Alert>
        <AlertTitle>Default Alert</AlertTitle>
      </Alert>
    );
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-background');
    expect(alert).toHaveClass('text-foreground');
  });
  
  it('forwards refs correctly to Alert component', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Alert ref={ref} data-testid="alert-with-ref">
        Alert with ref
      </Alert>
    );
    
    expect(ref.current).not.toBeNull();
    expect(ref.current).toHaveAttribute('data-testid', 'alert-with-ref');
  });
}); 