import React from 'react';
import { GraduationCap } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <p className="text-gray-600 font-medium">Loading AI-LMS...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;