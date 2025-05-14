'use client';
import { useAuthStore } from '@/stores/useAuthStore';
import Link from 'next/link';
import React from 'react';

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <div>
      Profile {JSON.stringify(user)}
      <Link href="/dashboard/admin"> dashboard</Link>
      <Link href="/"> home</Link>
    </div>
  );
};

export default ProfilePage;
