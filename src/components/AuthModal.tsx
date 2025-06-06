
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, EyeOff, User, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialType }) => {
  const [authType, setAuthType] = useState<'login' | 'signup'>(initialType);
  const [showPassword, setShowPassword] = useState(false);
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
          {/* Auth Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setAuthType('login')}
              className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-sm font-medium transition-colors ${
                authType === 'login'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthType('signup')}
              className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-sm font-medium transition-colors ${
                authType === 'signup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Google Sign In */}
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

          {/* User Role Selection for Signup */}
          {authType === 'signup' && (
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">I am a</Label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setUserRole('tenant')}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-colors ${
                    userRole === 'tenant'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-primary" />
                  <span className="text-xs sm:text-sm font-medium">Tenant</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole('landlord')}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-colors ${
                    userRole === 'landlord'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Home className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-primary" />
                  <span className="text-xs sm:text-sm font-medium">Landlord</span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {authType === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="text-sm sm:text-base"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className="text-sm sm:text-base"
                autoComplete="email"
                required
              />
            </div>

            {authType === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="text-sm sm:text-base"
                  autoComplete="tel"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className="text-sm sm:text-base pr-10"
                  autoComplete={authType === 'login' ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authType === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className="text-sm sm:text-base"
                  autoComplete="new-password"
                  required
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-dark text-white text-sm sm:text-base py-2 sm:py-3"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (authType === 'login' ? 'Login' : 'Create Account')}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-xs sm:text-sm text-gray-600">
            {authType === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthType('signup')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthType('login')}
                  className="text-primary hover:underline font-medium"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
