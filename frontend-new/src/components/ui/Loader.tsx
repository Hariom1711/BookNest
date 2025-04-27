// src/components/ui/Loader.tsx
// import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Loader = ({ size = 'md', className = '' }: LoaderProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div 
      className={`${sizeClasses[size]} border-zinc-600 border-t-purple-600 rounded-full animate-spin ${className}`}
      aria-label="Loading"
    ></div>
  );
};

export default Loader;