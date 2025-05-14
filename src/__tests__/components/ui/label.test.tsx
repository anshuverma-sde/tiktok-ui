import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from '@/components/ui/label';

describe('Label Component', () => {
  it('renders with default props', () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with htmlFor attribute', () => {
    const htmlFor = 'test-input';
    render(<Label htmlFor={htmlFor}>Test Label</Label>);
    expect(screen.getByText('Test Label')).toHaveAttribute('for', htmlFor);
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    const { container } = render(
      <Label className={customClass}>Test Label</Label>
    );
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('renders with custom attributes', () => {
    render(
      <Label
        data-testid="test-label"
        aria-label="Test Label"
      >
        Test Label
      </Label>
    );
    
    const label = screen.getByTestId('test-label');
    expect(label).toHaveAttribute('aria-label', 'Test Label');
  });

  it('applies default styles', () => {
    const { container } = render(<Label>Test Label</Label>);
    const label = container.firstChild;
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none');
  });

  it('handles peer disabled state', () => {
    const { container } = render(<Label>Test Label</Label>);
    const label = container.firstChild;
    expect(label).toHaveClass('peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70');
  });
}); 