import { cn } from '@/lib/utils';

describe('cn (className) utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('text-red-500', 'bg-blue-200')).toBe('text-red-500 bg-blue-200');
  });

  it('should handle conditional class names', () => {
    const isActive = true;
    const isPrimary = false;

    expect(
      cn(
        'base-class',
        isActive && 'active-class',
        isPrimary && 'primary-class'
      )
    ).toBe('base-class active-class');
  });

  it('should handle array of class names', () => {
    expect(cn(['text-lg', 'font-bold'], 'p-4')).toBe('text-lg font-bold p-4');
  });

  it('should handle empty or falsy inputs', () => {
    expect(cn('', false, null, undefined, 'valid-class')).toBe('valid-class');
  });

  it('should handle Tailwind class conflicts', () => {
    // The last conflicting class should win
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-sm text-red-500', 'text-blue-500')).toBe('text-sm text-blue-500');
  });

  it('should handle complex class combinations with variants', () => {
    expect(
      cn(
        'flex items-center',
        'sm:flex-row md:flex-col',
        'dark:bg-gray-800'
      )
    ).toBe('flex items-center sm:flex-row md:flex-col dark:bg-gray-800');
  });
}); 