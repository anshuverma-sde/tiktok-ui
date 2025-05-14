import Link from 'next/link';
import React from 'react';

const page = () => {
  return (
    <div>
      Admin
      <Link href="/profile"> profile</Link>
    </div>
  );
};

export default page;
