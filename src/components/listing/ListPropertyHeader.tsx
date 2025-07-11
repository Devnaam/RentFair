
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">List Your Property</h1>
          </div>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={onPreview}
              disabled={!formData.property_type}
              className="w-full sm:w-auto"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={onPublish}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-dark w-full sm:w-auto"
              size="sm"
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
