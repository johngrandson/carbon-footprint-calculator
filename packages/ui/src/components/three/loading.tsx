'use client';

interface LoadingProps {
  className?: string;
  message?: string;
}

export function Loading({
  className,
  message = 'Loading 3D scene...'
}: LoadingProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20"></div>
        <p className="text-white/60 text-sm">{message}</p>
      </div>
    </div>
  );
}
