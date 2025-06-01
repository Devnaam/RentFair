
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ListingFormData } from '@/types/listing';

interface AmenitiesFormProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
}

const AmenitiesForm: React.FC<AmenitiesFormProps> = ({ formData, updateFormData }) => {
  const amenityCategories = {
    'Common': [
      'Wi-Fi', 'Power Backup', 'Parking', 'Elevator', 'Gated Community', 
      '24/7 Security', 'CCTV', 'Intercom'
    ],
    'Kitchen': [
      'Refrigerator', 'Washing Machine', 'Microwave', 'Gas Stove', 
      'RO Water Purifier', 'Dishwasher'
    ],
    'Room Specific': [
      'AC', 'Geyser', 'Study Table', 'Wardrobe', 'Balcony', 'Attached Bathroom'
    ],
    'Building/Community': [
      'Gym', 'Swimming Pool', 'Play Area', 'Clubhouse', 'Garden', 
      'Jogging Track', 'Library'
    ],
    'Special Categories': [
      'Student-Friendly', 'Family-Friendly', 'Female-Only', 
      'Suitable for Sharers/Groups', 'English-Speaking Landlord', 'Pet-Friendly'
    ]
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const updatedAmenities = checked
      ? [...formData.amenities, amenity]
      : formData.amenities.filter(a => a !== amenity);
    updateFormData({ amenities: updatedAmenities });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities</CardTitle>
        <p className="text-sm text-gray-600">
          Select all amenities available at your property. This helps tenants find exactly what they're looking for.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(amenityCategories).map(([category, amenities]) => (
          <div key={category} className="space-y-3">
            <Label className="text-base font-medium text-gray-900">{category}</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenities.map(amenity => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                  />
                  <Label htmlFor={amenity} className="text-sm cursor-pointer">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {formData.amenities.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              ✓ You've selected {formData.amenities.length} amenities. 
              Properties with more amenities typically get 2x more inquiries!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AmenitiesForm;
