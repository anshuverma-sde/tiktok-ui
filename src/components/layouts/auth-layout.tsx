'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/images/logo.png'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  footerContent?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
  footerContent,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8 sm:p-6 md:py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center">
            <Image 
              src={logo} 
              alt="Brand Logo" 
              width={150} 
              height={40} 
              className="h-8 sm:h-10 w-auto"
              priority
            />
          </Link>
        </div>

        <Card className="shadow-lg w-full border-gray-200">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl sm:text-2xl text-center font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription className="text-center text-sm sm:text-base">{description}</CardDescription>
            )}
          </CardHeader>
          
          {children}
          
          {footerContent && (
            <CardFooter className="flex flex-col pt-6">
              {footerContent}
            </CardFooter>
          )}
        </Card>
        
        {/* Support link */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Need help? <Link href="/help" style={{color:'#28a745'}} className="text-brand-600 hover:underline font-medium">Contact support</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 