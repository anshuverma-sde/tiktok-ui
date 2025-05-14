import { StaticImageData } from 'next/image';
import { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export interface MenuItem {
  name: string;
  href: string;
  icon: string | StaticImageData;
  active?: boolean;
  nested?: MenuItem[];
}
