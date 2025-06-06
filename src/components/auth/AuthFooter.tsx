
import React from 'react';

interface AuthFooterProps {
  authType: 'login' | 'signup';
  onAuthTypeChange: (type: 'login' | 'signup') => void;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ authType, onAuthTypeChange }) => {
  return (
    <div className="text-center text-xs sm:text-sm text-gray-600">
      {authType === 'login' ? (
        <>
          Don't have an account?{' '}
          <button
            onClick={() => onAuthTypeChange('signup')}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </button>
        </>
      ) : (
        <>
          Already have an account?{' '}
          <button
            onClick={() => onAuthTypeChange('login')}
            className="text-primary hover:underline font-medium"
          >
            Login
          </button>
        </>
      )}
    </div>
  );
};

export default AuthFooter;
