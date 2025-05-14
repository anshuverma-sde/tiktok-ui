import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useToast, toast as globalToast, reducer } from '@/components/ui/use-toast';
import { type ToastActionElement } from '@/components/ui/toast';

// We need to run tests in isolation due to the shared state in use-toast
jest.mock('@/components/ui/use-toast', () => {
  const actualModule = jest.requireActual('@/components/ui/use-toast');
  return actualModule;
});

describe('useToast Hook', () => {
  it('returns toast function and toasts array', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toast).toBeDefined();
    expect(result.current.toasts).toBeDefined();
  });

  it('adds a toast to the toasts array', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Test Title',
        description: 'Test Description'
      });
    });

    expect(result.current.toasts.length).toBeGreaterThan(0);
    expect(result.current.toasts[0].title).toBe('Test Title');
    expect(result.current.toasts[0].description).toBe('Test Description');
  });

  it('handles different toast variants', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Success',
        description: 'Operation successful',
        variant: 'default'
      });
    });

    const defaultToast = result.current.toasts.find(t => t.title === 'Success');
    expect(defaultToast?.variant).toBe('default');
    
    // Add another toast with a different variant
    act(() => {
      result.current.toast({
        title: 'Error',
        description: 'Operation failed',
        variant: 'destructive'
      });
    });

    const destructiveToast = result.current.toasts.find(t => t.title === 'Error');
    expect(destructiveToast?.variant).toBe('destructive');
  });

  it('dismisses a toast', () => {
    const { result } = renderHook(() => useToast());
    let toastId: string;
    
    act(() => {
      const { id } = result.current.toast({
        title: 'Toast to dismiss',
      });
      toastId = id;
    });

    // Find our specific toast
    const ourToast = result.current.toasts.find(t => t.id === toastId);
    expect(ourToast).toBeDefined();
    expect(ourToast?.open).toBe(true);
    
    // Dismiss the toast
    act(() => {
      result.current.dismiss(toastId);
    });

    // Find our toast again and check if it's now closed
    const dismissedToast = result.current.toasts.find(t => t.id === toastId);
    expect(dismissedToast?.open).toBe(false);
  });

  it('dismisses all toasts when no ID is provided', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      // Add multiple toasts
      result.current.toast({ title: 'Toast 1' });
      result.current.toast({ title: 'Toast 2' });
      result.current.toast({ title: 'Toast 3' });
    });
    
    expect(result.current.toasts.length).toBeGreaterThanOrEqual(3);
    
    // Get the initial state of toasts
    const initialOpenState = result.current.toasts.map(t => ({ id: t.id, open: t.open }));
    
    // Dismiss all toasts
    act(() => {
      result.current.dismiss(); // No ID means dismiss all
    });
    
    // All toasts should now be marked as closed
    for (const toast of initialOpenState) {
      const dismissedToast = result.current.toasts.find(t => t.id === toast.id);
      expect(dismissedToast?.open).toBe(false);
    }
  });

  it('handles toast with action element', () => {
    const { result } = renderHook(() => useToast());
    
    const actionElement: ToastActionElement = (
      <button data-testid="toast-action">Action</button>
    );
    
    act(() => {
      result.current.toast({
        title: 'Toast with Action',
        action: actionElement
      });
    });

    const actionToast = result.current.toasts.find(t => t.title === 'Toast with Action');
    expect(actionToast?.action).toBeDefined();
  });

  it('creates a toast with custom duration', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Custom Duration Toast',
        duration: 5000
      });
    });

    const durationToast = result.current.toasts.find(t => t.title === 'Custom Duration Toast');
    expect(durationToast?.duration).toBe(5000);
  });
  
  it('updates an existing toast', () => {
    const { result } = renderHook(() => useToast());
    let toastId: string;
    
    act(() => {
      const { id, update } = result.current.toast({
        title: 'Original Title',
        description: 'Original Description'
      });
      toastId = id;
      
      // Update the toast
      update({
        id,
        title: 'Updated Title',
        description: 'Updated Description'
      });
    });
    
    const updatedToast = result.current.toasts.find(t => t.id === toastId);
    expect(updatedToast?.title).toBe('Updated Title');
    expect(updatedToast?.description).toBe('Updated Description');
  });
  
  it('limits the number of toasts shown', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      // Add more toasts than the limit (which is 5)
      for (let i = 0; i < 10; i++) {
        result.current.toast({
          title: `Toast ${i + 1}`
        });
      }
    });
    
    // Should be limited to the TOAST_LIMIT constant (which is 5)
    expect(result.current.toasts.length).toBeLessThanOrEqual(5);
  });

  it('uses global toast function outside of React components', () => {
    const { id, dismiss, update } = globalToast({
      title: 'Global Toast'
    });
    
    const { result } = renderHook(() => useToast());
    const globalToastInState = result.current.toasts.find(t => t.id === id);
    
    expect(globalToastInState).toBeDefined();
    expect(globalToastInState?.title).toBe('Global Toast');
    
    // Test the update function returned by the global toast
    act(() => {
      update({
        id,
        title: 'Updated Global Toast'
      });
    });
    
    const updatedGlobalToast = result.current.toasts.find(t => t.id === id);
    expect(updatedGlobalToast?.title).toBe('Updated Global Toast');
    
    // Test the dismiss function returned by the global toast
    act(() => {
      dismiss();
    });
    
    const dismissedGlobalToast = result.current.toasts.find(t => t.id === id);
    expect(dismissedGlobalToast?.open).toBe(false);
  });
  
  it('removes a toast completely after REMOVE_TOAST action', () => {
    const initialState = {
      toasts: [{ id: '1', title: 'Toast to remove', open: false }]
    };
    
    // Use the reducer directly to test REMOVE_TOAST action
    const nextState = reducer(initialState, {
      type: 'REMOVE_TOAST',
      toastId: '1'
    });
    
    expect(nextState.toasts.length).toBe(0);
  });
  
  it('removes all toasts when REMOVE_TOAST action has no ID', () => {
    const initialState = {
      toasts: [
        { id: '1', title: 'Toast 1', open: false },
        { id: '2', title: 'Toast 2', open: false },
        { id: '3', title: 'Toast 3', open: false }
      ]
    };
    
    // Use the reducer directly to test REMOVE_TOAST action with no ID
    const nextState = reducer(initialState, {
      type: 'REMOVE_TOAST'
    });
    
    expect(nextState.toasts.length).toBe(0);
  });
}); 