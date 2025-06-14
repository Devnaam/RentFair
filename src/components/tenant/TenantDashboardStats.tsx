
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Clock, Reply, Eye } from 'lucide-react';

interface TenantDashboardStatsProps {
  stats: {
    totalInquiries: number;
    recentInquiries: number;
    respondedInquiries: number;
    viewedProperties: number;
  } | undefined;
  isLoading: boolean;
}

const TenantDashboardStats = ({ stats, isLoading }: TenantDashboardStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Inquiries</p>
              <p className="text-xl sm:text-2xl font-bold">
                {isLoading ? '...' : stats?.totalInquiries || 0}
              </p>
            </div>
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Recent Inquiries</p>
              <p className="text-xl sm:text-2xl font-bold">
                {isLoading ? '...' : stats?.recentInquiries || 0}
              </p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Responded</p>
              <p className="text-xl sm:text-2xl font-bold">
                {isLoading ? '...' : stats?.respondedInquiries || 0}
              </p>
            </div>
            <Reply className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Viewed</p>
              <p className="text-xl sm:text-2xl font-bold">
                {isLoading ? '...' : stats?.viewedProperties || 0}
              </p>
            </div>
            <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantDashboardStats;
