
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { ListingFormData } from '@/types/listing';

interface RentFeesFormProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
}

const RentFeesForm: React.FC<RentFeesFormProps> = ({ formData, updateFormData }) => {
  const utilitiesOptions = [
    'Electricity', 'Water', 'Wi-Fi', 'Gas', 'Maintenance', 'Security'
  ];

  const handleUtilityChange = (utility: string, checked: boolean) => {
    const updatedUtilities = checked
      ? [...formData.utilities_included, utility]
      : formData.utilities_included.filter(u => u !== utility);
    updateFormData({ utilities_included: updatedUtilities });
  };

  const addAdditionalFee = () => {
    updateFormData({
      additional_fees: [
        ...formData.additional_fees,
        { fee_name: '', amount: 0, frequency: 'monthly' }
      ]
    });
  };

  const updateAdditionalFee = (index: number, field: string, value: string | number) => {
    const updatedFees = formData.additional_fees.map((fee, i) => {
      if (i === index) {
        return { ...fee, [field]: value };
      }
      return fee;
    });
    updateFormData({ additional_fees: updatedFees });
  };

  const removeAdditionalFee = (index: number) => {
    const updatedFees = formData.additional_fees.filter((_, i) => i !== index);
    updateFormData({ additional_fees: updatedFees });
  };

  // AI Price Estimation (mock for now)
  const getEstimatedRent = () => {
    if (!formData.property_type || !formData.city) return null;
    
    // Mock estimation based on property type and city
    const baseRent = {
      'single_room': 8000,
      'full_flat_1bhk': 15000,
      'full_flat_2bhk': 25000,
      'full_flat_3bhk_plus': 35000,
      'pg_hostel_room': 6000,
      'shared_room': 5000
    }[formData.property_type] || 10000;

    const min = Math.round(baseRent * 0.8);
    const max = Math.round(baseRent * 1.2);
    
    return { min, max };
  };

  const estimatedRent = getEstimatedRent();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rent & Fees</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Rent */}
        <div className="space-y-2">
          <Label htmlFor="monthly_rent">Monthly Rent (₹) *</Label>
          <Input
            id="monthly_rent"
            type="number"
            value={formData.monthly_rent?.toString() || ''}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value ? parseInt(value, 10) : null;
              updateFormData({ monthly_rent: numValue });
            }}
            placeholder="Enter monthly rent"
          />
          {estimatedRent && (
            <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              💡 AI Estimate: Based on similar properties, a fair rent could be ₹{estimatedRent.min.toLocaleString()} - ₹{estimatedRent.max.toLocaleString()}
            </p>
          )}
        </div>

        {/* Security Deposit */}
        <div className="space-y-2">
          <Label htmlFor="security_deposit">Security Deposit (₹) *</Label>
          <Input
            id="security_deposit"
            type="number"
            value={formData.security_deposit?.toString() || ''}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value ? parseInt(value, 10) : null;
              updateFormData({ security_deposit: numValue });
            }}
            placeholder="Enter security deposit"
          />
        </div>

        {/* Additional Fees */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Additional Fees (Optional)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAdditionalFee}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Fee
            </Button>
          </div>
          
          {formData.additional_fees.map((fee, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg">
              <div className="space-y-1">
                <Label className="text-xs">Fee Name</Label>
                <Input
                  value={fee.fee_name}
                  onChange={(e) => updateAdditionalFee(index, 'fee_name', e.target.value)}
                  placeholder="e.g., Maintenance"
                  size="sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Amount (₹)</Label>
                <Input
                  type="number"
                  value={fee.amount?.toString() || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = value ? parseInt(value, 10) : 0;
                    updateAdditionalFee(index, 'amount', numValue);
                  }}
                  placeholder="Amount"
                  size="sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Frequency</Label>
                <Select
                  value={fee.frequency}
                  onValueChange={(value) => updateAdditionalFee(index, 'frequency', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_time">One-time</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeAdditionalFee(index)}
                  className="h-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Utilities Included */}
        <div className="space-y-3">
          <Label>Utilities Included</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {utilitiesOptions.map(utility => (
              <div key={utility} className="flex items-center space-x-2">
                <Checkbox
                  id={utility}
                  checked={formData.utilities_included.includes(utility)}
                  onCheckedChange={(checked) => handleUtilityChange(utility, checked as boolean)}
                />
                <Label htmlFor={utility} className="text-sm">{utility}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RentFeesForm;
