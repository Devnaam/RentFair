
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import AuthTypeToggle from './auth/AuthTypeToggle';
import UserRoleSelector from './auth/UserRoleSelector';
import AuthForm from './auth/AuthForm';
import AuthFooter from './auth/AuthFooter';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialType }) => {
  const [authType, setAuthType] = useState<'login' | 'signup'>(initialType);
  const [userRole, setUserRole] = useState<'tenant' | 'landlord'>('tenant');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });

  const { signUp, signIn, signInWithGoogle } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      return 'Email and password are required';
    }
    
    if (authType === 'signup') {
      if (!formData.name || !formData.phone) {
        return 'Name and phone are required';
      }
      if (formData.password !== formData.confirmPassword) {
        return 'Passwords do not match';
      }
      if (formData.password.length < 6) {
        return 'Password must be at least 6 characters';
      }
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      return;
    }

    setLoading(true);

    try {
      let result;
      
      if (authType === 'signup') {
        result = await signUp(formData.email, formData.password, {
          name: formData.name,
          phone: formData.phone,
          role: userRole
        });
      } else {
        result = await signIn(formData.email, formData.password);
      }

      if (!result.error) {
        onClose();
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          name: '',
          phone: ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md mx-auto max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-center text-xl sm:text-2xl font-bold">
            {authType === 'login' ? 'Welcome Back' : 'Join RentFair'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          <AuthTypeToggle authType={authType} onAuthTypeChange={setAuthType} />

          <Button
            type="button"
            variant="outline"
            className="w-full text-sm sm:text-base"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {authType === 'signup' && (
            <UserRoleSelector userRole={userRole} onRoleChange={setUserRole} />
          )}

          <AuthForm
            authType={authType}
            formData={formData}
            loading={loading}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />

          <AuthFooter authType={authType} onAuthTypeChange={setAuthType} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
