import React from 'react';
import { ExamType } from '../types';

interface LoaderProps {
  message?: string;
  activeExamType: ExamType;
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-96" aria-live="polite" aria-busy="true">
      <div className="ai-loader">
        <div className="ai-loader-ring"></div>
        <div className="ai-loader-ring"></div>
        <div className="ai-loader-ring"></div>
        <div className="ai-loader-core"></div>
      </div>
      <p className="mt-8 text-lg font-semibold text-gray-300 text-center px-4">{message}</p>
    </div>
  );
};

export default Loader;