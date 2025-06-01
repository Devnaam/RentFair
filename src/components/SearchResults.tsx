
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Heart, Wifi, Car, Home } from 'lucide-react';
import { Property } from '@/hooks/usePropertySearch';

interface SearchResultsProps {
  properties: Property[];
  isLoading: boolean;
  error: any;
}

const SearchResults: React.FC<SearchResultsProps> = ({ properties, isLoading, error }) => {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
      case 'wi-fi':
        return <Wifi className="w-3 h-3" />;
      case 'parking':
        return <Car className="w-3 h-3" />;
      default:
        return <Home className="w-3 h-3" />;
    }
  };

  const formatPropertyType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'single_room': 'Single Room',
      'full_flat_1bhk': '1 BHK',
      'full_flat_2bhk': '2 BHK',
      'full_flat_3bhk_plus': '3+ BHK',
      'pg_hostel_room': 'PG/Hostel',
      'shared_room': 'Shared Room'
    };
    return typeMap[type] || type;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Searching properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading properties. Please try again.</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No properties found matching your criteria.</p>
        <p className="text-sm text-gray-500 mt-2">Try adjusting your search filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Search Results</h2>
        <p className="text-gray-600">{properties.length} properties found</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 relative">
              {property.photos && property.photos.length > 0 ? (
                <img 
                  src={property.photos[0]} 
                  alt={property.title || 'Property'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {property.title || `${formatPropertyType(property.property_type)} in ${property.city}`}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.street_address}, {property.city}, {property.state}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">₹{property.monthly_rent.toLocaleString()}</span>
                    <span className="text-gray-600 text-sm">/month</span>
                  </div>
                  <Badge variant="secondary">{formatPropertyType(property.property_type)}</Badge>
                </div>
                
                {property.bedrooms && property.bathrooms && (
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{property.bedrooms} Bed</span>
                    <span>{property.bathrooms} Bath</span>
                  </div>
                )}
                
                {property.amenities && property.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs flex items-center gap-1">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </Badge>
                    ))}
                    {property.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{property.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Button className="w-full">View Details</Button>
                  <div className="text-xs text-gray-500 text-center">
                    Security Deposit: ₹{property.security_deposit.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
