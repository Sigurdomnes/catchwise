'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, we couldn’t find the page you’re looking for.</p>
      <Link href="/">
        <p style={{ color: '#0070f3', textDecoration: 'underline' }}>
          Go back home
        </p>
      </Link>
    </div>
  );
}