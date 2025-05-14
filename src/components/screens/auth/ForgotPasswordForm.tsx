'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/layouts/auth-layout';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CardContent } from '@/components/ui/card';
import { useForgotPasswordMutation } from '@/lib/api/mutations/auth';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { mutate: forgotPassword, isPending, error } = useForgotPasswordMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    forgotPassword({ email }, {
      onSuccess: () => {
        setIsSubmitted(true);
      }
    });
  };

  const resetForm = () => {
    setIsSubmitted(false);
  };

  return (
    <AuthLayout 
      title="Reset Your Password" 
      description="Enter your email address and we'll send you a link to reset your password"
      footerContent={
        <>
          {!isSubmitted ? (
            <>
              <Button 
                type="submit" 
                className="w-full bg-black text-white hover:bg-gray-800"
                disabled={isPending || !email}
                form="forgot-password-form"
              >
                {isPending ? "Sending..." : "Reset Password"}
              </Button>
              <p className="mt-4 text-center text-sm text-gray-600">
                Remember your password?{" "}
                <Link href="/login" style={{color:'#28a745'}} className="hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <Button 
                type="button"
                className="w-full bg-black text-white hover:bg-gray-800"
                onClick={() => window.location.href = '/login'}
              >
                Return to Login
              </Button>
              <p className="mt-4 text-center text-sm text-gray-600">
                <button 
                  className="text-green-600 hover:underline bg-transparent border-none p-0 cursor-pointer font-medium"
                  onClick={resetForm}
                  type="button"
                >
                  Try a different email address
                </button>
              </p>
            </>
          )}
        </>
      }
    >
      <form id="forgot-password-form" onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && !isSubmitted && (
            <Alert variant="destructive" className="text-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error ? error.message : "User not found. Please check your email and try again."}
              </AlertDescription>
            </Alert>
          )}
          
          {isSubmitted && (
            <Alert className="text-sm bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Password reset instructions have been sent to <strong>{email}</strong>. Please check your inbox.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isPending || isSubmitted}
              className="focus:border-brand-600"
            />
          </div>

          {error && !isSubmitted && (
            <div className="text-xs text-gray-500 mt-1">
              Please verify your email address and try again.
            </div>
          )}

          {isSubmitted && (
            <div className="text-xs text-gray-500 mt-2">
              The email may take a few minutes to arrive. Please check your spam folder if you don't see it in your inbox.
            </div>
          )}
        </CardContent>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordForm;