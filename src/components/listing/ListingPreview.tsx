
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, Home, Users, Wifi, Car } from 'lucide-react';
import { ListingFormData } from '@/types/listing';

interface ListingPreviewProps {
  formData: ListingFormData;
  onBack: () => void;
}

const ListingPreview: React.FC<ListingPreviewProps> = ({ formData, onBack }) => {
  const getPropertyTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'single_room': 'Single Room',
      'full_flat_1bhk': '1BHK Flat',
      'full_flat_2bhk': '2BHK Flat',
      'full_flat_3bhk_plus': '3BHK+ Flat',
      'pg_hostel_room': 'PG/Hostel Room',
      'shared_room': 'Shared Room'
    };
    return labels[type] || type;
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Not specified';
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Edit
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Listing Preview</h1>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-0">
            {/* Photo Gallery */}
            {formData.photos.length > 0 && (
              <div className="relative h-96 rounded-t-lg overflow-hidden">
                <img
                  src={formData.photos[0]}
                  alt="Property main photo"
                  className="w-full h-full object-cover"
                />
                {formData.photos.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                    +{formData.photos.length - 1} more photos
                  </div>
                )}
                {formData.broker_free && (
                  <Badge className="absolute top-4 left-4 bg-green-600">
                    Broker-Free
                  </Badge>
                )}
              </div>
            )}

            <div className="p-6 space-y-6">
              {/* Title and Basic Info */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">
                      {getPropertyTypeLabel(formData.property_type)} in {formData.city}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{formData.street_address}, {formData.city}, {formData.state} - {formData.pincode}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {formatCurrency(formData.monthly_rent)}
                    </div>
                    <div className="text-sm text-gray-600">per month</div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="flex space-x-6 text-sm text-gray-600">
                  {formData.bedrooms && (
                    <div className="flex items-center">
                      <Home className="w-4 h-4 mr-1" />
                      {formData.bedrooms} {formData.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                    </div>
                  )}
                  {formData.bathrooms && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {formData.bathrooms} {formData.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                    </div>
                  )}
                  {formData.size_sqft && (
                    <div>{formData.size_sqft} sq ft</div>
                  )}
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Property Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Furnishing:</span> {formData.furnishing_status.replace('_', ' ')}</div>
                    <div><span className="font-medium">Security Deposit:</span> {formatCurrency(formData.security_deposit)}</div>
                    <div><span className="font-medium">Minimum Stay:</span> {formData.minimum_stay_months} months</div>
                    {formData.maximum_stay_months && (
                      <div><span className="font-medium">Maximum Stay:</span> {formData.maximum_stay_months} months</div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="font-medium">Available from:</span> {formData.availability_date}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Utilities & Fees</h3>
                  <div className="space-y-2 text-sm">
                    {formData.utilities_included.length > 0 && (
                      <div>
                        <span className="font-medium">Utilities Included:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.utilities_included.map(utility => (
                            <Badge key={utility} variant="secondary" className="text-xs">
                              {utility}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {formData.additional_fees.length > 0 && (
                      <div>
                        <span className="font-medium">Additional Fees:</span>
                        <div className="mt-1">
                          {formData.additional_fees.map((fee, index) => (
                            <div key={index} className="text-xs">
                              {fee.fee_name}: ₹{fee.amount} ({fee.frequency})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {formData.amenities.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map(amenity => (
                      <Badge key={amenity} variant="outline" className="text-sm">
                        {amenity === 'Wi-Fi' && <Wifi className="w-3 h-3 mr-1" />}
                        {amenity === 'Parking' && <Car className="w-3 h-3 mr-1" />}
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* House Rules */}
              {formData.house_rules && (
                <div>
                  <h3 className="font-semibold mb-3">House Rules</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {formData.house_rules}
                  </p>
                </div>
              )}

              {/* Furnished Items */}
              {formData.furnished_items.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Furnished Items</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.furnished_items.map(item => (
                      <Badge key={item} variant="secondary" className="text-sm">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Flexibility Notes */}
              {formData.flexibility_notes && (
                <div>
                  <h3 className="font-semibold mb-3">Additional Notes</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {formData.flexibility_notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListingPreview;
