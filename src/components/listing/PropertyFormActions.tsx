
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Eye, Send } from 'lucide-react';
import { ListingFormData } from '@/types/listing';
import { validateForm } from '@/utils/listingValidation';

interface PropertyFormActionsProps {
  formData: ListingFormData;
  onPreview: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
}

const PropertyFormActions: React.FC<PropertyFormActionsProps> = ({
  formData,
  onPreview,
  onSaveDraft,
  onPublish,
  isSubmitting
}) => {
  const validation = validateForm(formData);
  const canPublish = validation.isValid;

  return (
    <div className="bg-white border rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold">Publish Your Listing</h3>
      <p className="text-gray-600 text-sm">
        Review your property details and publish when ready. You can always save as draft and publish later.
      </p>
      
      {!canPublish && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm font-medium">
            Complete the following to publish:
          </p>
          <p className="text-amber-700 text-sm mt-1">
            {validation.message}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onPreview}
          disabled={!formData.property_type || isSubmitting}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview Listing
        </Button>
        
        <Button
          variant="outline"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="flex-1"
        >
          <Save className="w-4 h-4 mr-2" />
          Save as Draft
        </Button>
        
        <Button
          onClick={onPublish}
          disabled={!canPublish || isSubmitting}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Publishing...' : 'Publish Listing'}
        </Button>
      </div>
    </div>
  );
};

export default PropertyFormActions;
