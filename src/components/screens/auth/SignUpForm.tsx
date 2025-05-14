'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Chip
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSignupMutation } from '@/lib/api/mutations/auth';
import AuthLayout from '@/components/layouts/auth-layout';

const SignUpPage = () => {
  const searchParams = useSearchParams();
  
  // Get plan and billing period from URL params
  const planParam = searchParams.get('plan');
  const billingParam = searchParams.get('billing') ?? 'monthly';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: '',
    agreeToTerms: false,
    // Store the selected plan and billing information
    plan: planParam ?? '',
    billing: billingParam
  });
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { mutate: signUp, isPending, error } = useSignupMutation();

  // Map plan keys to human-readable names
  const planNames: {[key: string]: string} = {
    'starter': 'Starter Plan',
    'growth': 'Growth Plan',
    'agency': 'Agency Plan'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.agreeToTerms) {
      setErrorMsg('You must agree to the terms & privacy policy.');
      return;
    }

    signUp(
      {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        // Also pass the plan and billing information
        // plan: formData.plan,
        // billing: formData.billing
      },
      {
        onSuccess: () => setSuccess(true),
        onError: (err: any) => {
          setErrorMsg(err.message ?? 'Signup failed. Please try again.');
        }
      }
    );
  };

  // Footer for form
  const footerContent = (
    <>
      <Button
        type="submit"
        form="signup-form"
        fullWidth
        variant="contained"
        disabled={isPending}
        sx={{
          bgcolor: '#000',
          '&:hover': { bgcolor: '#222' },
          py: 1.5,
          textTransform: 'none',
          fontWeight: 'bold'
        }}
      >
        {isPending ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign Up'}
      </Button>
      <Typography variant="body2" align="center" sx={{ mt: 4 }}>
        Already have an account?{' '}
        <Link href="/login" passHref>
          <Typography
            component="a"
            sx={{
              color: '#28a745',
              fontWeight: 500,
              fontSize: '0.875rem',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Sign in
          </Typography>
        </Link>
      </Typography>
    </>
  );

  // Success screen
  if (success) {
    return (
      <AuthLayout title="Verification Email Sent" description="" footerContent={null}>
        <Box sx={{ maxWidth: 400, mx: 'auto', px: 2, py: 6, textAlign: 'center' }}>
          <CheckCircleOutline sx={{ fontSize: 64, color: '#28a745', mb: 2 }} />
          {/* <Typography variant="h5" fontWeight="bold" gutterBottom>
            Verification Email Sent
          </Typography> */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            A verification link has been sent to <strong>{formData.email}</strong>.<br/>
            Please check your inbox to activate your account.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => window.location.assign('/login')}
            sx={{
              bgcolor: '#000',
              '&:hover': { bgcolor: '#222' },
              py: 1.5,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Back to Login
          </Button>
        </Box>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your information to get started"
      footerContent={footerContent}
    >
      <Box
        component="form"
        id="signup-form"
        onSubmit={onSubmit}
        sx={{
          maxWidth: 400,
          mx: 'auto',
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {(errorMsg || error) && (
          <Alert variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMsg ?? error?.message}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Display selected plan if available */}
        {planParam && planNames[planParam] && (
          <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Selected Plan:
            </Typography>
            <Chip
              label={`${planNames[planParam]} (${billingParam === 'yearly' ? 'Yearly' : 'Monthly'})`}
              color="success"
              sx={{ fontWeight: 'bold' }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.8rem' }}>
              <Link href="/plan" passHref>
                <Typography component="span" sx={{ color: '#28a745', cursor: 'pointer', fontSize: '0.8rem' }}>
                  Change plan
                </Typography>
              </Link>
            </Typography>
          </Box>
        )}

        <TextField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
          fullWidth
        />

        <FormControlLabel
          control={
            <Checkbox
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
          }
          label={
            <Typography variant="body2">
              I agree to the{' '}
              <Link href="/terms" passHref>
                <Typography component="span" sx={{ color: '#28a745', cursor: 'pointer' }}>
                  terms of service
                </Typography>
              </Link>{' '}
              and{' '}
              <Link href="/privacy" passHref>
                <Typography component="span" sx={{ color: '#28a745', cursor: 'pointer' }}>
                  privacy policy
                </Typography>
              </Link>
            </Typography>
          }
        />
      </Box>
    </AuthLayout>
  );
};

export default SignUpPage;