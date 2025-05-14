/**
 * Simple test for the Not Found page
 */
import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

describe('NotFound Page', () => {
  it('renders the not found message', () => {
    render(<NotFound />);
    
    // Check that the not found text is rendered
    expect(screen.getByText('NotFound')).toBeInTheDocument();
  });
  
  it('renders as a div element', () => {
    render(<NotFound />);
    
    // Check that it's rendered as a div
    const notFoundElement = screen.getByText('NotFound');
    expect(notFoundElement.tagName).toBe('DIV');
  });
}); 