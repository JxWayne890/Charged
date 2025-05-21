
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="pt-24 pb-12 flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default LoadingState;
