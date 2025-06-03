
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="terms"
            className="mt-1"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to RentFair's{' '}
            <Link 
              to="/terms-and-conditions" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms and Conditions
            </Link>{' '}
            and{' '}
            <Link 
              to="/listing-policy" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Listing Policy
            </Link>
            . I confirm that I have the legal right to rent this property and that all information provided is accurate and truthful.
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default TermsAndConditions;
