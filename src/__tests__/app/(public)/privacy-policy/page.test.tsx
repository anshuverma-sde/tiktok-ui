import React from 'react';
import { render, screen } from '@testing-library/react';
import PrivacyPolicyPage from '@/app/(public)/privacy-policy/page';

describe('Privacy Policy Page', () => {
  it('renders the privacy policy page', () => {
    render(<PrivacyPolicyPage />);
    
    expect(screen.getByText('policy')).toBeInTheDocument();
  });
}); 