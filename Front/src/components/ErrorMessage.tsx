import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;