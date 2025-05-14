'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircleOutline
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetPasswordMutation } from '@/lib/api/mutations/auth';
import Link from 'next/link';
import logo from '../../../../public/images/logo.png'
import Image from 'next/image';


const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        'Must include uppercase, lowercase, number & special char'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type FormValues = z.infer<typeof resetPasswordSchema>;

const friendlyErrorMessages: Record<string, string> = {
  INVALID_RESET_TOKEN: 'Your reset link is invalid or expired. Please request a new password link.',
};

const ResetPasswordPage = () => {
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const router = useRouter();

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<{ code?: string; message?: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange'
  });

  const resetMutation = useResetPasswordMutation();

  const onSubmit = (data: FormValues) => {
    if (!token) return;
    setApiError(null);
    resetMutation.mutate(
      { token, newPassword: data.password },
      {
        onSuccess: () => setSubmitted(true),
        onError: (err: any) => {
          setApiError({
            code: err.errorCode,
            message: err.message
          });
        }
      }
    );
  };

  // auto-redirect after success
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => router.push('/login'), 10000);
      return () => clearTimeout(timer);
    }
  }, [submitted, router]);

  const canSubmit = isValid && !!token && !resetMutation.isPending;

  if (!token) {
    return (
      <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', py: 8, px: 2, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Reset Your Password
            </Typography>
            <Alert severity="error" sx={{ mb: 2 }}>
              Invalid or missing reset token.
            </Alert>
            <Link href="/forgot-password" passHref>
              <Button variant="contained" fullWidth>
                Request new link
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', py: 8, px: 2, display: 'flex', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <CheckCircleOutline sx={{ fontSize: 64, color: '#28a745', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Password Reset!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Your password has been updated successfully.
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
                Redirecting to login in 4 seconds...
              </Typography>
              <Link href="/login" passHref>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ bgcolor: '#000', '&:hover': { bgcolor: '#222' }, textTransform: 'none', py: 1.5, borderRadius: 1 }}
                >
                  Back to Login Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', py: 8, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* <Box component="img" src='images/logo.png' alt="Affli.ai" sx={{ width: 120, mb: 4 }} /> */}
      <Image 
              src={logo} 
              alt="Brand Logo" 
              width={150} 
              height={40} 
              className="h-8 sm:h-10 w-auto"
              priority
            />
        

      <Card sx={{ width: '100%', maxWidth: 420, borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" align="center" fontWeight="bold" gutterBottom>
            Reset Your Password
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter a new password to secure your account
          </Typography>

          {/* Friendly API error */}
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {friendlyErrorMessages[apiError.code!] ?? apiError.message}
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="New Password"
              type={showPwd ? 'text' : 'password'}
              fullWidth
              required
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPwd(!showPwd)}>
                        {showPwd ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              fullWidth
              required
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!canSubmit}
              sx={{ mt: 1, py: 1.5, bgcolor: '#000', borderRadius: 1, textTransform: 'none', fontWeight: 'bold', '&:hover': { bgcolor: '#222' } }}
            >
              {resetMutation.isPending
                ? <CircularProgress size={24} sx={{ color: '#fff' }} />
                : 'Reset Password'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Remembered?{' '}
              <Link href="/login" passHref>
                <Typography component="span" sx={{ color: '#28a745', fontWeight: 'medium', cursor: 'pointer' }}>
                  Sign in
                </Typography>
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPasswordPage;
