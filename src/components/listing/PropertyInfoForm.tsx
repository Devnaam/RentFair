
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ListingFormData } from '@/pages/ListProperty';

interface PropertyInfoFormProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
}

const PropertyInfoForm: React.FC<PropertyInfoFormProps> = ({ formData, updateFormData }) => {
  const propertyTypes = [
    { value: 'single_room', label: 'Single Room' },
    { value: 'full_flat_1bhk', label: 'Full Flat (1BHK)' },
    { value: 'full_flat_2bhk', label: 'Full Flat (2BHK)' },
    { value: 'full_flat_3bhk_plus', label: 'Full Flat (3BHK+)' },
    { value: 'pg_hostel_room', label: 'PG/Hostel Room' },
    { value: 'shared_room', label: 'Shared Room' }
  ];

  const furnishedItems = [
    'Bed', 'Mattress', 'Wardrobe', 'Study Table', 'Sofa', 'Dining Table',
    'Refrigerator', 'Washing Machine', 'Microwave', 'AC', 'Geyser', 'TV'
  ];

  const handleFurnishedItemChange = (item: string, checked: boolean) => {
    const updatedItems = checked
      ? [...formData.furnished_items, item]
      : formData.furnished_items.filter(i => i !== item);
    updateFormData({ furnished_items: updatedItems });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Type */}
        <div className="space-y-2">
          <Label htmlFor="property_type">Property Type *</Label>
          <Select value={formData.property_type} onValueChange={(value) => updateFormData({ property_type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="street_address">Street Address *</Label>
            <Input
              id="street_address"
              value={formData.street_address}
              onChange={(e) => updateFormData({ street_address: e.target.value })}
              placeholder="Enter full address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => updateFormData({ city: e.target.value })}
              placeholder="Enter city"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => updateFormData({ state: e.target.value })}
              placeholder="Enter state"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              value={formData.pincode}
              onChange={(e) => updateFormData({ pincode: e.target.value })}
              placeholder="Enter pincode"
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="size_sqft">Size (sq. ft.)</Label>
            <Input
              id="size_sqft"
              type="number"
              value={formData.size_sqft || ''}
              onChange={(e) => updateFormData({ size_sqft: e.target.value ? parseInt(e.target.value) : null })}
              placeholder="Enter size"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Select value={formData.bedrooms?.toString() || ''} onValueChange={(value) => updateFormData({ bedrooms: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Studio</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Select value={formData.bathrooms?.toString() || ''} onValueChange={(value) => updateFormData({ bathrooms: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Furnishing Status */}
        <div className="space-y-2">
          <Label>Furnishing Status *</Label>
          <div className="flex space-x-4">
            {[
              { value: 'unfurnished', label: 'Unfurnished' },
              { value: 'semi_furnished', label: 'Semi-Furnished' },
              { value: 'fully_furnished', label: 'Fully Furnished' }
            ].map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="furnishing_status"
                  value={option.value}
                  checked={formData.furnishing_status === option.value}
                  onChange={(e) => updateFormData({ furnishing_status: e.target.value })}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Furnished Items */}
        {formData.furnishing_status === 'fully_furnished' && (
          <div className="space-y-2">
            <Label>Furnished Items</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {furnishedItems.map(item => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={item}
                    checked={formData.furnished_items.includes(item)}
                    onCheckedChange={(checked) => handleFurnishedItemChange(item, checked as boolean)}
                  />
                  <Label htmlFor={item} className="text-sm">{item}</Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* House Rules */}
        <div className="space-y-2">
          <Label htmlFor="house_rules">House Rules</Label>
          <Textarea
            id="house_rules"
            value={formData.house_rules}
            onChange={(e) => updateFormData({ house_rules: e.target.value })}
            placeholder="e.g., No pets, No smoking, No loud music after 10 PM..."
            rows={3}
          />
        </div>

        {/* Lease Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minimum_stay">Minimum Stay (months) *</Label>
            <Select value={formData.minimum_stay_months.toString()} onValueChange={(value) => updateFormData({ minimum_stay_months: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 month</SelectItem>
                <SelectItem value="3">3 months</SelectItem>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="11">11 months</SelectItem>
                <SelectItem value="12">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maximum_stay">Maximum Stay (months)</Label>
            <Select value={formData.maximum_stay_months?.toString() || ''} onValueChange={(value) => updateFormData({ maximum_stay_months: value ? parseInt(value) : null })}>
              <SelectTrigger>
                <SelectValue placeholder="Flexible" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 months</SelectItem>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="11">11 months</SelectItem>
                <SelectItem value="12">1 year</SelectItem>
                <SelectItem value="24">2 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Flexibility Notes */}
        <div className="space-y-2">
          <Label htmlFor="flexibility_notes">Flexibility Notes</Label>
          <Textarea
            id="flexibility_notes"
            value={formData.flexibility_notes}
            onChange={(e) => updateFormData({ flexibility_notes: e.target.value })}
            placeholder="Any special terms or flexibility you offer..."
            rows={2}
          />
        </div>

        {/* Availability Date */}
        <div className="space-y-2">
          <Label htmlFor="availability_date">Availability Date *</Label>
          <Input
            id="availability_date"
            type="date"
            value={formData.availability_date}
            onChange={(e) => updateFormData({ availability_date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Broker-Free */}
        <div className="flex items-center space-x-2">
          <Switch
            id="broker_free"
            checked={formData.broker_free}
            onCheckedChange={(checked) => updateFormData({ broker_free: checked })}
          />
          <Label htmlFor="broker_free">Broker-Free Listing</Label>
          {formData.broker_free && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Broker-Free Badge
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyInfoForm;
