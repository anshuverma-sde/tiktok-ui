import React from 'react';
import { render, screen } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

describe('Tabs Component', () => {
  it('renders basic tabs structure', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('applies custom className to TabsList', () => {
    const customClass = 'custom-tabs-list';
    render(
      <Tabs defaultValue="tab1">
        <TabsList className={customClass}>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByRole('tablist')).toHaveClass(customClass);
  });

  it('applies custom className to TabsTrigger', () => {
    const customClass = 'custom-trigger';
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" className={customClass}>Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByRole('tab')).toHaveClass(customClass);
  });

  it('applies custom className to TabsContent', () => {
    const customClass = 'custom-content';
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className={customClass}>Content 1</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole('tabpanel')).toHaveClass(customClass);
  });

  it('handles disabled state on TabsTrigger', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" disabled>Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByRole('tab')).toBeDisabled();
  });
  
  it('forwards refs correctly to TabsList', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Tabs defaultValue="tab1">
        <TabsList ref={ref}>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current).toHaveAttribute('role', 'tablist');
  });
  
  it('forwards refs correctly to TabsTrigger', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger ref={ref} value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current).toHaveAttribute('role', 'tab');
  });
  
  it('forwards refs correctly to TabsContent', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent ref={ref} value="tab1">Content 1</TabsContent>
      </Tabs>
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current).toHaveAttribute('role', 'tabpanel');
  });

}); 