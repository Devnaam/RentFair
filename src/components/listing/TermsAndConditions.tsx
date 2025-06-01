
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TermsAndConditions: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="terms"
            className="mt-1"
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to RentFair's{' '}
            <a href="#" className="text-primary hover:underline">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline">
              Listing Policy
            </a>
            .
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default TermsAndConditions;
