
import React from 'react';
import { Label } from '@/components/ui/label';
import { User, Home } from 'lucide-react';

interface UserRoleSelectorProps {
  userRole: 'tenant' | 'landlord';
  onRoleChange: (role: 'tenant' | 'landlord') => void;
}

const UserRoleSelector: React.FC<UserRoleSelectorProps> = ({ userRole, onRoleChange }) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm sm:text-base">I am a</Label>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => onRoleChange('tenant')}
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
          onClick={() => onRoleChange('landlord')}
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
  );
};

export default UserRoleSelector;
