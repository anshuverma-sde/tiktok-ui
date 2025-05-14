'use client';

import { useLoaderStore } from '@/stores/useLoaderStore';

export const Loader = () => {
  const { isLoading, message } = useLoaderStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="relative size-12">
          <div className="absolute size-full animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
        </div>

        {message && (
          <p className="max-w-xs text-center text-sm font-medium text-gray-600 dark:text-gray-300">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};
