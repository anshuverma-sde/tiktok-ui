import React from 'react';
import { render, screen } from '@testing-library/react';
import TermsPage from '@/app/(public)/terms/page';

describe('Terms Page', () => {
  it('renders the terms page', () => {
    render(<TermsPage />);
    
    expect(screen.getByText('terms')).toBeInTheDocument();
  });
}); 