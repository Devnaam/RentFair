
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  IndianRupee, 
  TrendingUp, 
  MessageSquare, 
  Users 
} from 'lucide-react';
import { DashboardStats as DashboardStatsType } from '@/services/dashboardService';

interface DashboardStatsProps {
  stats?: DashboardStatsType;
  isLoading: boolean;
}

const DashboardStats = ({ stats, isLoading }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="ml-2 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Monthly Revenue</p>
              <p className="text-lg sm:text-2xl font-bold truncate">
                {isLoading ? '...' : `₹${stats?.monthlyRevenue?.toLocaleString() || 0}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="ml-2 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Views</p>
              <p className="text-lg sm:text-2xl font-bold">
                {isLoading ? '...' : stats?.totalViews || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="ml-2 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">New Inquiries</p>
              <p className="text-lg sm:text-2xl font-bold">
                {isLoading ? '...' : stats?.newInquiries || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <div className="ml-2 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Active Properties</p>
              <p className="text-lg sm:text-2xl font-bold">
                {isLoading ? '...' : stats?.activeProperties || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
