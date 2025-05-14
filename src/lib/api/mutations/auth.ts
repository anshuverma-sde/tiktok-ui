import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLoaderStore } from '@/stores/useLoaderStore';
import { AuthService } from '../services/authService';
import { ResetPasswordCredentials } from '../types/auth.types';

export const useLoginMutation = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { showLoader, hideLoader } = useLoaderStore();

  return useMutation({
    mutationFn: async (values: { email: string; password: string; rememberMe?: boolean }) => {
      showLoader('Signing in...');
      try {
        const res = await AuthService.login({
          email: values.email,
          password: values.password,
          rememberMe: values.rememberMe || false,
        });
        if (res?.success && res.data) {
          return res.data;
        }
        throw new Error(res.message);
      } finally {
        hideLoader();
      }
    },
    onSuccess: (data) => {
      login({
        id: data.user._id,
        email: data.user.email,
        role: data.user.role,
        name: data.user.name,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      toast.success('Login successful!');
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed. Please try again.');
    },
  });
};

export const useSignupMutation = () => {
  const { showLoader, hideLoader } = useLoaderStore();

  return useMutation({
    mutationFn: async (values: {
      name: string;
      email: string;
      password: string;
      companyName: string;
    }) => {
      showLoader('Signing up...');
      try {
        const res = await AuthService.signUp({
          name: values.name,
          email: values.email,
          password: values.password,
          companyName: values.companyName,
        });

        if (res?.success) {
          return res;
        }
        throw new Error(res.message);
      } finally {
        hideLoader();
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Signup failed. Please try again.');
    },
  });
};

export const useForgotPasswordMutation = () => {
  const { showLoader, hideLoader } = useLoaderStore();

  return useMutation({
    mutationFn: async (values: { email: string }) => {
      showLoader('Sending Email...');
      try {
        const res = await AuthService.forgotPassword({
          email: values.email,
        });

        if (res?.success) {
          return res;
        }
        throw new Error(res.message);
      } finally {
        hideLoader();
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed. Please try again.');
    },
  });
};

export const useResetPasswordMutation = () => {
  const { showLoader, hideLoader } = useLoaderStore();

  return useMutation({

    mutationFn: async (values: ResetPasswordCredentials) => {
      showLoader('Resetting...');
      try {
        const res = await AuthService.resetPassword({
          token: values?.token,
          newPassword: values?.newPassword,
        });

        if (res?.success) {
          return res;
        }
        throw new Error(res.message);
      } finally {
        hideLoader();
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed. Please try again.');
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const logoutFromStore = useAuthStore((state) => state.logout);
  const { showLoader, hideLoader } = useLoaderStore();

  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      showLoader('Signing out...');
      try {
        const res = await AuthService.logout();
        if (!res?.success) throw new Error(res.message || 'Logout failed');
        return res;
      } finally {
        hideLoader();
      }
    },
    onSuccess: async () => {
      logoutFromStore();
      toast.success('Logged out successfully');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Logout failed. Please try again.');
    },
  });
};

export const useVerifyEmailMutation = () => {
  const { showLoader, hideLoader } = useLoaderStore();

  return useMutation({
    mutationKey: ['verifyEmail'],
    mutationFn: async (token: string) => {
      showLoader('Verifying email...');
      try {
        const res = await AuthService.verifyEmail({ token });
        if (res?.success) {
          return res;
        }
        throw new Error(res.message || 'Email verification failed');
      } finally {
        hideLoader();
      }
    },
    onSuccess: (data) => {

      toast.success(data.message || 'Email verified successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Verification failed. Please try again.');
    }
  });
};