
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { ListingFormData } from '@/types/listing';

interface RentFeesFormProps {
  form: UseFormReturn<ListingFormData>;
}

const RentFeesForm: React.FC<RentFeesFormProps> = ({ form }) => {
  const { register, watch, setValue, formState: { errors } } = form;
  const additionalFees = watch('additionalFees') || [];

  const addFee = () => {
    const currentFees = additionalFees || [];
    setValue('additionalFees', [
      ...currentFees,
      { feeName: '', amount: 0, frequency: 'monthly' }
    ]);
  };

  const removeFee = (index: number) => {
    const currentFees = additionalFees || [];
    setValue('additionalFees', currentFees.filter((_, i) => i !== index));
  };

  const updateFee = (index: number, field: string, value: string | number) => {
    const currentFees = additionalFees || [];
    const updatedFees = [...currentFees];
    if (field === 'amount') {
      updatedFees[index] = { ...updatedFees[index], [field]: Number(value) };
    } else {
      updatedFees[index] = { ...updatedFees[index], [field]: value };
    }
    setValue('additionalFees', updatedFees);
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
              <Label htmlFor="monthlyRent">Monthly Rent (₹) *</Label>
              <Input
                id="monthlyRent"
                type="number"
                {...register('monthlyRent', { 
                  required: 'Monthly rent is required',
                  min: { value: 1, message: 'Rent must be greater than 0' },
                  valueAsNumber: true
                })}
                placeholder="Enter monthly rent"
              />
              {errors.monthlyRent && (
                <p className="text-red-500 text-sm mt-1">{errors.monthlyRent.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="securityDeposit">Security Deposit (₹) *</Label>
              <Input
                id="securityDeposit"
                type="number"
                {...register('securityDeposit', { 
                  required: 'Security deposit is required',
                  min: { value: 0, message: 'Security deposit cannot be negative' },
                  valueAsNumber: true
                })}
                placeholder="Enter security deposit"
              />
              {errors.securityDeposit && (
                <p className="text-red-500 text-sm mt-1">{errors.securityDeposit.message}</p>
              )}
            </div>
          </div>

          {/* Broker Fee */}
          <div>
            <Label>Broker Fee</Label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  {...register('brokerFree')}
                  value="true"
                  className="w-4 h-4"
                />
                <span>No Broker Fee</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  {...register('brokerFree')}
                  value="false"
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
                      value={fee.feeName}
                      onChange={(e) => updateFee(index, 'feeName', e.target.value)}
                      placeholder="e.g., Maintenance"
                    />
                  </div>
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      value={fee.amount || ''}
                      onChange={(e) => updateFee(index, 'amount', parseInt(e.target.value) || 0)}
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
