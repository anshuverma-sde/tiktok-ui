// app/verify-email/page.tsx
import { Suspense } from 'react';

import { Box, CircularProgress } from '@mui/material';
import VerifyEmailPage from '@/components/screens/auth/verify-email';

interface VerifyEmailServerProps {
  readonly searchParams: { token?: string };
}

export default function VerifyEmailServerPage({
  searchParams,
}: VerifyEmailServerProps) {
  const token = searchParams.token ?? '';
  
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    }>
      <VerifyEmailPage emailToken={token} />
    </Suspense>
  );
}