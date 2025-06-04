
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { ListingFormData } from '@/types/listing';

interface RentFeesFormProps {
  formData: ListingFormData;
  updateFormData: (section: Partial<ListingFormData>) => void;
}

const RentFeesForm: React.FC<RentFeesFormProps> = ({ formData, updateFormData }) => {
  const additionalFees = formData.additional_fees || [];

  const addFee = () => {
    updateFormData({
      additional_fees: [
        ...additionalFees,
        { fee_name: '', amount: 0, frequency: 'monthly' }
      ]
    });
  };

  const removeFee = (index: number) => {
    const updatedFees = additionalFees.filter((_, i) => i !== index);
    updateFormData({ additional_fees: updatedFees });
  };

  const updateFee = (index: number, field: string, value: string | number) => {
    const updatedFees = [...additionalFees];
    if (field === 'amount') {
      updatedFees[index] = { ...updatedFees[index], [field]: Number(value) };
    } else {
      updatedFees[index] = { ...updatedFees[index], [field]: value };
    }
    updateFormData({ additional_fees: updatedFees });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rent & Fees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Monthly Rent */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthly_rent">Monthly Rent (₹) *</Label>
              <Input
                id="monthly_rent"
                type="number"
                value={formData.monthly_rent || ''}
                onChange={(e) => updateFormData({ monthly_rent: Number(e.target.value) || null })}
                placeholder="Enter monthly rent"
              />
            </div>

            <div>
              <Label htmlFor="security_deposit">Security Deposit (₹) *</Label>
              <Input
                id="security_deposit"
                type="number"
                value={formData.security_deposit || ''}
                onChange={(e) => updateFormData({ security_deposit: Number(e.target.value) || null })}
                placeholder="Enter security deposit"
              />
            </div>
          </div>

          {/* Broker Fee */}
          <div>
            <Label>Broker Fee</Label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={formData.broker_free === true}
                  onChange={() => updateFormData({ broker_free: true })}
                  className="w-4 h-4"
                />
                <span>No Broker Fee</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={formData.broker_free === false}
                  onChange={() => updateFormData({ broker_free: false })}
                  className="w-4 h-4"
                />
                <span>Broker Fee Applicable</span>
              </label>
            </div>
          </div>

          {/* Additional Fees */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Additional Fees (Optional)</Label>
              <Button type="button" onClick={addFee} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Fee
              </Button>
            </div>

            {additionalFees.map((fee, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Fee Name</Label>
                    <Input
                      value={fee.fee_name}
                      onChange={(e) => updateFee(index, 'fee_name', e.target.value)}
                      placeholder="e.g., Maintenance"
                    />
                  </div>
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      value={fee.amount || ''}
                      onChange={(e) => updateFee(index, 'amount', Number(e.target.value) || 0)}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Select 
                      value={fee.frequency} 
                      onValueChange={(value) => updateFee(index, 'frequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Button 
                      type="button" 
                      onClick={() => removeFee(index)} 
                      variant="outline" 
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentFeesForm;
