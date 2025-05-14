import { LayoutProps, MenuItem } from '@/types/global';
import { ReactNode } from 'react';
import { StaticImageData } from 'next/image';

describe('Global Types', () => {
  it('should define LayoutProps interface correctly', () => {
    // Create a mock object that conforms to LayoutProps
    const layoutProps: LayoutProps = {
      children: 'Test Child' as unknown as ReactNode
    };
    
    // Assert the object has the expected properties
    expect(layoutProps).toHaveProperty('children');
  });
  
  it('should define MenuItem interface correctly', () => {
    // Create a mock object that conforms to MenuItem
    const menuItem: MenuItem = {
      name: 'Test Item',
      href: '/test',
      icon: 'test-icon'
    };
    
    // Create a menu item with nested items
    const nestedMenuItem: MenuItem = {
      name: 'Parent Item',
      href: '/parent',
      icon: 'parent-icon',
      active: true,
      nested: [menuItem]
    };
    
    // Assert the objects have the expected properties
    expect(menuItem).toHaveProperty('name');
    expect(menuItem).toHaveProperty('href');
    expect(menuItem).toHaveProperty('icon');
    
    expect(nestedMenuItem).toHaveProperty('active');
    expect(nestedMenuItem).toHaveProperty('nested');
    expect(nestedMenuItem.nested).toHaveLength(1);
  });
}); 