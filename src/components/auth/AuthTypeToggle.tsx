
import React from 'react';

interface AuthTypeToggleProps {
  authType: 'login' | 'signup';
  onAuthTypeChange: (type: 'login' | 'signup') => void;
}

const AuthTypeToggle: React.FC<AuthTypeToggleProps> = ({ authType, onAuthTypeChange }) => {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onAuthTypeChange('login')}
        className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-sm font-medium transition-colors ${
          authType === 'login'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Login
      </button>
      <button
        onClick={() => onAuthTypeChange('signup')}
        className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-sm font-medium transition-colors ${
          authType === 'signup'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthTypeToggle;
