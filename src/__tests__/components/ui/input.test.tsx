import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  it('renders with all input types and states', () => {
    const types = ['text', 'password', 'email', 'number', 'search', 'tel', 'url', 'file'] as const;
    const { rerender } = render(<Input data-testid="input" />);
    
    // Test all input types
    types.forEach(type => {
      rerender(<Input type={type} data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', type);
    });

    // Test disabled and required states
    rerender(<Input disabled required data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
  });

  it('handles user interactions and form submission', () => {
    const handleChange = jest.fn();
    const handleSubmit = jest.fn(e => e.preventDefault());
    
    render(
      <form onSubmit={handleSubmit} data-testid="test-form">
        <Input 
          onChange={handleChange}
          placeholder="Test input"
          data-testid="input"
        />
      </form>
    );

    const input = screen.getByTestId('input');
    
    // Test value change
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test');

    // Test form submission
    const form = screen.getByTestId('test-form');
    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('renders input with basic props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex', 'h-12', 'w-full');
  });
}); 