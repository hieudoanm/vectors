import type { FC } from 'react';

const Loading: FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="border-t-primary h-8 w-8 animate-spin rounded-full border-4 border-gray-300" />
    </div>
  );
};

export default Loading;
