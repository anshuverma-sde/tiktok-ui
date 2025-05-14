'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { resetPasswordSchema } from '@/lib/validations/authSchema';
import AuthLayout from '@/components/layouts/auth-layout';
import { useResetPasswordMutation } from '@/lib/api/mutations/auth';
import { ResetPasswordCredentials } from '@/lib/api/types/auth.types';
import { useSearchParams } from 'next/navigation';

import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';

const ResetPasswordForm = () => {
  const [localError, setLocalError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const { mutate: resetPassword, isPending, error } = useResetPasswordMutation();

  const handleSubmit = (values: { newPassword: string; confirmPassword: string }) => {
    setLocalError(null);

    if (!token) {
      setLocalError('Invalid or missing reset token');
      return;
    }

    const payload: ResetPasswordCredentials = {
      token,
      newPassword: values.newPassword,
    };

    resetPassword(payload, {
      onError: (err: any) => setLocalError(err.message || 'Reset failed'),
      onSuccess: () => {
        // you might redirect or show a toast here
      }
    });
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      description="Enter your new password below"
    >
      <Box sx={{ maxWidth: 400, mx: 'auto', px: 2 }}>
        {(error ?? localError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError ?? error?.message}
          </Alert>
        )}

        {!token && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Missing reset token. Please use the link emailed to you.
          </Alert>
        )}

        <Formik
          initialValues={{ newPassword: '', confirmPassword: '' }}
          validationSchema={resetPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                name="newPassword"
                type="password"
                label="New Password"
                placeholder="••••••••"
                fullWidth
                required
                disabled={isPending ?? !token}
                error={Boolean(errors.newPassword && touched.newPassword)}
                helperText={<ErrorMessage name="newPassword" />}
                sx={{ mb: 2 }}
              />

              <Field
                as={TextField}
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                fullWidth
                required
                disabled={isPending ?? !token}
                error={Boolean(errors.confirmPassword && touched.confirmPassword)}
                helperText={<ErrorMessage name="confirmPassword" />}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isPending ?? !token}
                sx={{
                  bgcolor: '#000',
                  '&:hover': { bgcolor: '#222' },
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                {isPending
                  ? <CircularProgress size={24} sx={{ color: '#fff' }} />
                  : 'Reset Password'}
              </Button>
            </Form>
          )}
        </Formik>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ mt: 4 }}
        >
          Remember your password?{' '}
          <Link href="/login" passHref>
            <Typography
              component="a"
              sx={{
                color: '#28a745',
                fontWeight: 500,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Sign in
            </Typography>
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default ResetPasswordForm;
