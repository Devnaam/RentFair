
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, User, Home } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialType }) => {
  const [authType, setAuthType] = useState<'login' | 'signup'>(initialType);
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState<'tenant' | 'landlord'>('tenant');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Auth submission:', { authType, userRole, formData });
    // TODO: Implement authentication logic
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {authType === 'login' ? 'Welcome Back' : 'Join RentFair'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Auth Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setAuthType('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                authType === 'login'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthType('signup')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                authType === 'signup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* User Role Selection for Signup */}
          {authType === 'signup' && (
            <div className="space-y-2">
              <Label>I am a</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setUserRole('tenant')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    userRole === 'tenant'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <span className="text-sm font-medium">Tenant</span>
                </button>
                <button
                  onClick={() => setUserRole('landlord')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    userRole === 'landlord'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Home className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <span className="text-sm font-medium">Landlord</span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authType === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {authType === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
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
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white">
              {authType === 'login' ? 'Login' : 'Create Account'}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
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
