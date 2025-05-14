import { cn, removeAllCookies } from '@/lib';
import Cookies from 'js-cookie';

// Mock Cookies
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  remove: jest.fn()
}));

describe('lib/index', () => {
  describe('cn function', () => {
    it('combines class names', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('handles undefined and null values', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toBe('class1 class2');
    });
  });

  describe('removeAllCookies function', () => {
    it('removes all cookies', () => {
      // Setup mock
      (Cookies.get as jest.Mock).mockReturnValue({
        cookie1: 'value1',
        cookie2: 'value2'
      });

      removeAllCookies();

      // Check that Cookies.remove was called for each cookie
      expect(Cookies.remove).toHaveBeenCalledWith('cookie1', { path: '/' });
      expect(Cookies.remove).toHaveBeenCalledWith('cookie2', { path: '/' });
      expect(Cookies.remove).toHaveBeenCalledTimes(2);
    });
  });
}); 