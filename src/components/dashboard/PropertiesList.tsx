
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from './PropertyCard';
import { PropertyWithStats } from '@/services/dashboardService';

interface PropertiesListProps {
  properties?: PropertyWithStats[];
  isLoading: boolean;
  onEditProperty: (id: string) => void;
  onViewProperty: (id: string) => void;
  onPublishProperty: (id: string) => void;
  onDeleteProperty: (id: string) => void;
  isPublishing: boolean;
  isDeleting: boolean;
}

const PropertiesList = ({
  properties,
  isLoading,
  onEditProperty,
  onViewProperty,
  onPublishProperty,
  onDeleteProperty,
  isPublishing,
  isDeleting
}: PropertiesListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 sm:p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 sm:p-8 text-center">
          <h3 className="text-base sm:text-lg font-semibold mb-2">No properties yet</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Start by adding your first property to the platform.
          </p>
          <Button onClick={() => navigate('/list-property')}>
            <Plus className="w-4 h-4 mr-2" />
            List Your First Property
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onEdit={onEditProperty}
          onView={onViewProperty}
          onPublish={onPublishProperty}
          onDelete={onDeleteProperty}
          isPublishing={isPublishing}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

export default PropertiesList;
