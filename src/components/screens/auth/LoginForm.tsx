'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CardContent } from "@/components/ui/card";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  EyeIcon,
  EyeOffIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useLoginMutation } from '@/lib/api/mutations/auth';
import AuthLayout from '@/components/layouts/auth-layout';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<Date | null>(null);

  const { mutate: login, isPending, error } = useLoginMutation();

  // Check if account is locked and update countdown
  useEffect(() => {
    const storedLockData = localStorage.getItem('account_lockout');
    if (storedLockData) {
      const lockData = JSON.parse(storedLockData);
      const lockoutEnd = new Date(lockData.lockoutEndTime);
      
      if (lockoutEnd > new Date()) {
        setIsLocked(true);
        setLockoutEndTime(lockoutEnd);
        
        // Update countdown every second
        const interval = setInterval(() => {
          if (lockoutEnd <= new Date()) {
            setIsLocked(false);
            setLockoutEndTime(null);
            localStorage.removeItem('account_lockout');
            clearInterval(interval);
          }
        }, 1000);
        
        return () => clearInterval(interval);
      } else {
        // Lockout period has expired
        localStorage.removeItem('account_lockout');
      }
    }
    
    // Check for stored failed attempts
    const storedAttempts = localStorage.getItem('failed_login_attempts');
    if (storedAttempts) {
      setFailedAttempts(parseInt(storedAttempts, 10));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Check if account is locked
    if (isLocked) {
      setLocalError('Too many login attempts. Please try again later.');
      return;
    }

    if (!email || !password) {
      setLocalError('Please enter both email and password');
      return;
    }

    login(
      { email, password, rememberMe },
      {
        onSuccess: () => {
          // Reset failed attempts on successful login
          localStorage.removeItem('failed_login_attempts');
          setFailedAttempts(0);
        },
        onError: (err: any) => {
          // Handle specific error cases
          let errorMessage;
          
          if (err.code === 'EMAIL_NOT_VERIFIED') {
            errorMessage = 'Your email is not verified. Please check your inbox.';
          } else if (err.code === 'ACCOUNT_INACTIVE') {
            errorMessage = 'Your account is inactive. Please contact support.';
          } else if (err.code === 'INVALID_EMAIL_PASSWORD') {
            errorMessage = 'Invalid email or password.';
            
            // Increment failed attempts
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);
            localStorage.setItem('failed_login_attempts', newAttempts.toString());
            
            // Check if account should be locked (after 5 attempts)
            if (newAttempts >= 5) {
              // Lock account for 15 minutes
              const lockoutEnd = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
              setIsLocked(true);
              setLockoutEndTime(lockoutEnd);
              localStorage.setItem('account_lockout', JSON.stringify({
                lockoutEndTime: lockoutEnd.toISOString()
              }));
              
              errorMessage = 'Too many login attempts. Please try again later.';
            }
          } else {
            errorMessage = err.message || 'Login failed. Please try again.';
          }
          
          setLocalError(errorMessage);
        }
      }
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Format remaining lockout time
  const getRemainingLockoutTime = () => {
    if (!lockoutEndTime) return '';
    
    const now = new Date();
    const diffMs = lockoutEndTime.getTime() - now.getTime();
    if (diffMs <= 0) return '';
    
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Footer content
  const footerContent = (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      <div className="text-center text-sm">
        Don't have an account?{' '}
        <Link href="/signup" className="font-semibold text-green-600 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );

  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your credentials to access your account"
      footerContent={footerContent}
    >
      <CardContent className="space-y-4 pt-0">
        {(localError || error) && (
          <Alert variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {localError ?? error?.message}
              {isLocked && lockoutEndTime && (
                <div className="mt-1">
                  Try again in {getRemainingLockoutTime()}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              disabled={isLocked}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-green-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-10"
                disabled={isLocked}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLocked}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember-me" 
              checked={rememberMe} 
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              disabled={isLocked}
            />
            <Label htmlFor="remember-me" className="text-sm">Remember me</Label>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-black hover:bg-gray-800 text-white"
            disabled={isPending || isLocked}
          >
            {isPending ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </CardContent>
    </AuthLayout>
  );
};

export default LoginPage;