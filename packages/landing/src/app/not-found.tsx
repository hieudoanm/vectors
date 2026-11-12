import Link from 'next/link';
import type { FC } from 'react';

const NotFound: FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-600 dark:text-gray-400">Page not found</p>
      <Link href="/" className="btn btn-primary btn-sm">
        Go home
      </Link>
    </div>
  );
};

export default NotFound;
