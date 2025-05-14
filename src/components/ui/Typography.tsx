'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 12 | 14 | 16 | 18 | 20 | 24 | 26 | 28 | 30 | 32 | 36;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: string;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  children,
  as: Component = 'p',
  size = 16,
  weight = 'normal',
  color = 'text-blue',
  className = '',
  leftIcon,
  rightIcon,
}) => {
  const sizeClasses: Record<number, string> = {
    12: 'text-[12px]',
    14: 'text-[14px]',
    16: 'text-[16px]',
    18: 'text-[18px]',
    20: 'text-[20px]',
    24: 'text-[24px]',
    26: 'text-[26px]',
    28: 'text-[28px]',
    30: 'text-[30px]',
    32: 'text-[32px]',
    36: 'text-[36px]',
  };

  const weightClasses: Record<string, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <Component
        className={cn(sizeClasses[size], weightClasses[weight], color)}
      >
        {children}
      </Component>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </div>
  );
};

export default Typography;
