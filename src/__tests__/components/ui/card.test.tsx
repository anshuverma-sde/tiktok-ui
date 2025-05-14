import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

describe('Card Components', () => {
  it('renders Card with default props', () => {
    render(<Card>Card Content</Card>);
    const card = screen.getByText('Card Content');
    expect(card).toHaveClass(
      'rounded-lg',
      'border',
      'bg-card',
      'text-card-foreground',
      'shadow-sm'
    );
  });

  it('renders CardHeader with default props', () => {
    render(<CardHeader>Header Content</CardHeader>);
    const header = screen.getByText('Header Content');
    expect(header).toHaveClass(
      'flex',
      'flex-col',
      'space-y-1.5',
      'p-6'
    );
  });

  it('renders CardTitle with default props', () => {
    render(<CardTitle>Card Title</CardTitle>);
    const title = screen.getByText('Card Title');
    expect(title.tagName.toLowerCase()).toBe('h3');
    expect(title).toHaveClass(
      'text-2xl',
      'font-semibold',
      'leading-none',
      'tracking-tight'
    );
  });

  it('renders CardDescription with default props', () => {
    render(<CardDescription>Card Description</CardDescription>);
    const description = screen.getByText('Card Description');
    expect(description.tagName.toLowerCase()).toBe('p');
    expect(description).toHaveClass(
      'text-sm',
      'text-muted-foreground'
    );
  });

  it('renders CardContent with default props', () => {
    render(<CardContent>Content</CardContent>);
    const content = screen.getByText('Content');
    expect(content).toHaveClass(
      'p-6',
      'pt-0'
    );
  });

  it('renders CardFooter with default props', () => {
    render(<CardFooter>Footer Content</CardFooter>);
    const footer = screen.getByText('Footer Content');
    expect(footer).toHaveClass(
      'flex',
      'items-center',
      'p-6',
      'pt-0'
    );
  });

  it('applies custom className to Card', () => {
    const customClass = 'custom-card';
    render(<Card className={customClass}>Card Content</Card>);
    const card = screen.getByText('Card Content');
    expect(card).toHaveClass(customClass);
  });

  it('applies custom className to CardHeader', () => {
    const customClass = 'custom-header';
    render(<CardHeader className={customClass}>Header Content</CardHeader>);
    const header = screen.getByText('Header Content');
    expect(header).toHaveClass(customClass);
  });

  it('applies custom className to CardTitle', () => {
    const customClass = 'custom-title';
    render(<CardTitle className={customClass}>Card Title</CardTitle>);
    const title = screen.getByText('Card Title');
    expect(title).toHaveClass(customClass);
  });

  it('applies custom className to CardDescription', () => {
    const customClass = 'custom-description';
    render(
      <CardDescription className={customClass}>Card Description</CardDescription>
    );
    const description = screen.getByText('Card Description');
    expect(description).toHaveClass(customClass);
  });

  it('applies custom className to CardContent', () => {
    const customClass = 'custom-content';
    render(<CardContent className={customClass}>Content</CardContent>);
    const content = screen.getByText('Content');
    expect(content).toHaveClass(customClass);
  });

  it('applies custom className to CardFooter', () => {
    const customClass = 'custom-footer';
    render(<CardFooter className={customClass}>Footer Content</CardFooter>);
    const footer = screen.getByText('Footer Content');
    expect(footer).toHaveClass(customClass);
  });

  it('renders a complete card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>This is a complete card example</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content goes here</p>
        </CardContent>
        <CardFooter>
          <p>Footer content</p>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Complete Card')).toBeInTheDocument();
    expect(screen.getByText('This is a complete card example')).toBeInTheDocument();
    expect(screen.getByText('Main content goes here')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('forwards refs correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Card with ref</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('spreads additional props to components', () => {
    const dataTestId = 'test-card';
    render(<Card data-testid={dataTestId}>Card with data-testid</Card>);
    expect(screen.getByTestId(dataTestId)).toBeInTheDocument();
  });

  it('renders card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Main Content</CardContent>
        <CardFooter>Footer Content</CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('renders card with basic content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Main Content</CardContent>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });
}); 