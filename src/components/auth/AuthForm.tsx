
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordField from './PasswordField';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
}

interface AuthFormProps {
  authType: 'login' | 'signup';
  formData: FormData;
  loading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  authType,
  formData,
  loading,
  onInputChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      {authType === 'signup' && (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
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
          onChange={(e) => onInputChange('email', e.target.value)}
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
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="Enter your phone number"
            className="text-sm sm:text-base"
            autoComplete="tel"
            required
          />
        </div>
      )}

      <PasswordField
        id="password"
        label="Password"
        value={formData.password}
        onChange={(value) => onInputChange('password', value)}
        placeholder="Enter your password"
        autoComplete={authType === 'login' ? 'current-password' : 'new-password'}
        required
      />

      {authType === 'signup' && (
        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={(value) => onInputChange('confirmPassword', value)}
          placeholder="Confirm your password"
          autoComplete="new-password"
          required
        />
      )}

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary-dark text-white text-sm sm:text-base py-2 sm:py-3"
        disabled={loading}
      >
        {loading ? 'Please wait...' : (authType === 'login' ? 'Login' : 'Create Account')}
      </Button>
    </form>
  );
};

export default AuthForm;
