import React from 'react';
import { render, screen } from '@testing-library/react';
import SettingsRoute from '@/app/(root)/settings/page';
import SettingsPage from '@/components/screens/accountSetting/page';

// Mock the settings page component
jest.mock('@/components/screens/accountSetting/page', () => {
  return jest.fn(() => <div data-testid="settings-page">Settings Content</div>);
});

describe('Settings Route', () => {
  it('renders the settings page component', () => {
    render(<SettingsRoute />);
    
    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
    expect(screen.getByText('Settings Content')).toBeInTheDocument();
    expect(SettingsPage).toHaveBeenCalled();
  });
}); 