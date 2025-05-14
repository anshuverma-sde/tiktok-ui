import React from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

describe('Avatar Component', () => {
  it('renders avatar with fallback', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('JD')).toBeInTheDocument();
  });
}); 