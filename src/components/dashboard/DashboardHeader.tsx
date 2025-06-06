
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  userName?: string;
  userEmail?: string;
}

const DashboardHeader = ({ userName, userEmail }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Landlord Dashboard</h1>
          <Badge variant="default" className="bg-yellow-100 text-yellow-800 border-yellow-200 w-fit">
            <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Landlord Account
          </Badge>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Welcome back, {userName || userEmail}! Manage your properties and connect with tenants
        </p>
      </div>
      <Button onClick={() => navigate('/list-property')} className="w-full sm:w-auto">
        <Plus className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Add New Property</span>
        <span className="sm:hidden">Add Property</span>
      </Button>
    </div>
  );
};

export default DashboardHeader;
