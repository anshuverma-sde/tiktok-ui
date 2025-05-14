'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useVerifyEmailMutation } from '@/lib/api/mutations/auth';

interface VerifyEmailProps {
  readonly emailToken: string;
}

export default function VerifyEmailPage({ emailToken }: Readonly<VerifyEmailProps>) {
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const hasRun = useRef(false);

  const mutation = useVerifyEmailMutation();

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!emailToken) {
      setErrorMsg('No verification token provided.');
      setStatus('error');
      return;
    }

    const verifyToken = async () => {
      try {
        await mutation.mutateAsync(emailToken);
        setStatus('success');
      } catch (err: any) {
        let msg = 'Verification failed. Please try again.';
        
        if (err.errorCode === 'EXPIRED_TOKEN') {
          msg = 'This link has expired. Please request a new verification email.';
        } else if (err.errorCode === 'INVALID_TOKEN') {
          msg = 'Invalid verification token. Please check your email for the correct link.';
        } else if (err.errorCode === 'ALREADY_VERIFIED') {
          msg = 'Your email is already verified. You can login to your account.';
        } else if (err.message) {
          msg = err.message;
        }
        
        setErrorMsg(msg);
        setStatus('error');
      }
    };

    verifyToken();
  }, [emailToken, mutation]);

  useEffect(() => {
    if (status !== 'success') return;
    const t = setTimeout(() => router.push('/login'), 10000);
    return () => clearTimeout(t);
  }, [status, router]);

  const goLogin = () => router.push('/login');
  const goSignup = () => router.push('/signup');

  return (
    <Box
      sx={{
        bgcolor: '#f9f9f9',
        minHeight: '100vh',
        py: 8,
        px: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 480 }}
      >
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            
            {/* LOADING state */}
            {status === 'loading' && (
              <>
                <CircularProgress sx={{ color: '#28a745' }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  Verifying your email…
                </Typography>
              </>
            )}

            {/* SUCCESS state */}
            {status === 'success' && (
              <>
                <CheckCircleOutline sx={{ fontSize: 64, color: '#28a745', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Email Verified!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Your email has been successfully verified.
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
                  Redirecting to login…
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={goLogin}
                  sx={{
                    bgcolor: '#000',
                    '&:hover': { bgcolor: '#222' },
                    height: 48,
                    borderRadius: 1,
                    textTransform: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Back to Login
                </Button>
              </>
            )}

            {/* ERROR state */}
            {status === 'error' && (
              <>
                <ErrorOutline sx={{ fontSize: 64, color: '#dc3545', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Verification Failed
                </Typography>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMsg}
                </Alert>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  The link may be expired or invalid.
                </Typography>
                
    
                
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={goSignup}
                    sx={{
                      bgcolor: '#000',
                      '&:hover': { bgcolor: '#222' },
                      height: 48,
                      textTransform: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    Sign Up
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={goLogin}
                    sx={{
                      color: '#000',
                      borderColor: '#000',
                      height: 48,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                    }}
                  >
                    Back to Login
                  </Button>
                </Box>
              </>
            )}

          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}