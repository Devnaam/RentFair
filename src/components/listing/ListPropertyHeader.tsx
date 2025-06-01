
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { ListingFormData } from '@/types/listing';

interface ListPropertyHeaderProps {
  formData: ListingFormData;
  onPreview: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
}

const ListPropertyHeader: React.FC<ListPropertyHeaderProps> = ({
  formData,
  onPreview,
  onSaveDraft,
  onPublish,
  isSubmitting
}) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">List Your Property</h1>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onPreview}
              disabled={!formData.property_type}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={onPublish}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-dark"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Listing'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPropertyHeader;
