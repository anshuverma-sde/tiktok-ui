import React from 'react';
import { render, screen } from '@testing-library/react';
import Typography from '@/components/ui/Typography';

describe('Typography Component', () => {
  it('renders with default props', () => {
    render(<Typography>Test Text</Typography>);
    const text = screen.getByText('Test Text');
    expect(text).toBeInTheDocument();
    expect(text.tagName.toLowerCase()).toBe('p');
    expect(text).toHaveClass('text-[16px]', 'font-normal', 'text-blue');
  });

  it('renders with custom element type', () => {
    render(<Typography as="h1">Heading</Typography>);
    const heading = screen.getByText('Heading');
    expect(heading.tagName.toLowerCase()).toBe('h1');
  });

  it('renders with custom size', () => {
    render(<Typography size={24}>Large Text</Typography>);
    const text = screen.getByText('Large Text');
    expect(text).toHaveClass('text-[24px]');
  });

  it('renders with custom weight', () => {
    render(<Typography weight="bold">Bold Text</Typography>);
    const text = screen.getByText('Bold Text');
    expect(text).toHaveClass('font-bold');
  });

  it('renders with custom color', () => {
    render(<Typography color="text-red-500">Colored Text</Typography>);
    const text = screen.getByText('Colored Text');
    expect(text).toHaveClass('text-red-500');
  });

  it('renders with custom className', () => {
    render(<Typography className="custom-class">Custom Text</Typography>);
    const container = screen.getByText('Custom Text').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('renders with left icon', () => {
    const LeftIcon = () => <span data-testid="left-icon">🌟</span>;
    render(<Typography leftIcon={<LeftIcon />}>Text with Left Icon</Typography>);
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByText('Text with Left Icon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    const RightIcon = () => <span data-testid="right-icon">🌟</span>;
    render(<Typography rightIcon={<RightIcon />}>Text with Right Icon</Typography>);
    
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByText('Text with Right Icon')).toBeInTheDocument();
  });

  it('renders with both icons', () => {
    const LeftIcon = () => <span data-testid="left-icon">🌟</span>;
    const RightIcon = () => <span data-testid="right-icon">🌟</span>;
    render(
      <Typography
        leftIcon={<LeftIcon />}
        rightIcon={<RightIcon />}
      >
        Text with Both Icons
      </Typography>
    );
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByText('Text with Both Icons')).toBeInTheDocument();
  });

  it('applies correct container styles', () => {
    const { container } = render(<Typography>Container Test</Typography>);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('renders with all heading levels', () => {
    const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
    headings.forEach((level) => {
      render(<Typography as={level}>{`${level} Heading`}</Typography>);
      const heading = screen.getByText(`${level} Heading`);
      expect(heading.tagName.toLowerCase()).toBe(level);
    });
  });

  it('renders with all available sizes', () => {
    const sizes = [12, 14, 16, 18, 20, 24, 26, 28, 30, 32, 36] as const;
    sizes.forEach((size) => {
      render(<Typography size={size}>{`Size ${size}`}</Typography>);
      const text = screen.getByText(`Size ${size}`);
      expect(text).toHaveClass(`text-[${size}px]`);
    });
  });

  it('renders with all available weights', () => {
    const weights = ['normal', 'medium', 'semibold', 'bold'] as const;
    const weightClasses = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };

    weights.forEach((weight) => {
      render(<Typography weight={weight}>{`Weight ${weight}`}</Typography>);
      const text = screen.getByText(`Weight ${weight}`);
      expect(text).toHaveClass(weightClasses[weight]);
    });
  });
}); 