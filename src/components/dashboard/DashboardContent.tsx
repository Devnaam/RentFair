
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import PropertiesList from './PropertiesList';
import { PropertyWithStats, DashboardStats } from '@/services/dashboardService';

interface DashboardContentProps {
  properties?: PropertyWithStats[];
  stats?: DashboardStats;
  isLoadingProperties: boolean;
  onEditProperty: (id: string) => void;
  onViewProperty: (id: string) => void;
  onPublishProperty: (id: string) => void;
  onDeleteProperty: (id: string) => void;
  isPublishing: boolean;
  isDeleting: boolean;
}

const DashboardContent = ({
  properties,
  stats,
  isLoadingProperties,
  onEditProperty,
  onViewProperty,
  onPublishProperty,
  onDeleteProperty,
  isPublishing,
  isDeleting
}: DashboardContentProps) => {
  const navigate = useNavigate();

  return (
    <Tabs defaultValue="properties" className="space-y-4 sm:space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="properties" className="text-xs sm:text-sm">My Properties</TabsTrigger>
        <TabsTrigger value="inquiries" onClick={() => navigate('/inquiries')} className="text-xs sm:text-sm">Inquiries</TabsTrigger>
        <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="properties" className="space-y-4 sm:space-y-6">
        <PropertiesList
          properties={properties}
          isLoading={isLoadingProperties}
          onEditProperty={onEditProperty}
          onViewProperty={onViewProperty}
          onPublishProperty={onPublishProperty}
          onDeleteProperty={onDeleteProperty}
          isPublishing={isPublishing}
          isDeleting={isDeleting}
        />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Property Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm sm:text-base">Analytics charts and performance metrics will be displayed here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardContent;
