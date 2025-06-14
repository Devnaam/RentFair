
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search } from 'lucide-react';

interface TenantDashboardHeaderProps {
  onRefreshData: () => void;
  onBrowseProperties: () => void;
}

const TenantDashboardHeader = ({ onRefreshData, onBrowseProperties }: TenantDashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tenant Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base">Welcome back! Track your property search and inquiries</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRefreshData} className="w-fit">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button onClick={onBrowseProperties} className="w-fit">
          <Search className="w-4 h-4 mr-2" />
          Find Properties
        </Button>
      </div>
    </div>
  );
};

export default TenantDashboardHeader;
