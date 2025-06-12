import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-2',
    lg: 'h-16 w-16 border-3',
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-t-purple-500 border-purple-300/30 ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;