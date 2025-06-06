
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PropertyInfoForm from '@/components/listing/PropertyInfoForm';
import RentFeesForm from '@/components/listing/RentFeesForm';
import PhotosVideoForm from '@/components/listing/PhotosVideoForm';
import AmenitiesForm from '@/components/listing/AmenitiesForm';
import ListingPreview from '@/components/listing/ListingPreview';
import ListPropertyHeader from '@/components/listing/ListPropertyHeader';
import TermsAndConditions from '@/components/listing/TermsAndConditions';
import PropertyFormActions from '@/components/listing/PropertyFormActions';
import { useListingSubmission } from '@/hooks/useListingSubmission';
import { ListingFormData } from '@/types/listing';

const ListProperty = () => {
  const { user, loading } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const { handleSubmit, isSubmitting } = useListingSubmission();
  
  const [formData, setFormData] = useState<ListingFormData>({
    property_type: '',
    street_address: '',
    city: '',
    state: '',
    pincode: '',
    size_sqft: null,
    bedrooms: null,
    bathrooms: null,
    furnishing_status: 'unfurnished',
    furnished_items: [],
    house_rules: '',
    minimum_stay_months: 1,
    maximum_stay_months: null,
    flexibility_notes: '',
    availability_date: '',
    broker_free: true,
    monthly_rent: null,
    security_deposit: null,
    utilities_included: [],
    additional_fees: [],
    photos: [],
    video_tour_url: '',
    amenities: []
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.user_metadata?.role !== 'landlord') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-4 sm:p-6 text-center">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-gray-600 text-sm sm:text-base mb-4">Only landlords can list properties.</p>
            <Button className="w-full" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const updateFormData = (section: Partial<ListingFormData>) => {
    setFormData(prev => ({ ...prev, ...section }));
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleSaveDraft = () => {
    handleSubmit(formData, true);
  };

  const handlePublish = () => {
    handleSubmit(formData, false);
  };

  if (showPreview) {
    return <ListingPreview formData={formData} onBack={() => setShowPreview(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ListPropertyHeader
        formData={formData}
        onPreview={handlePreview}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isSubmitting={isSubmitting}
      />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
        <PropertyInfoForm formData={formData} updateFormData={updateFormData} />
        <RentFeesForm formData={formData} updateFormData={updateFormData} />
        <PhotosVideoForm formData={formData} updateFormData={updateFormData} />
        <AmenitiesForm formData={formData} updateFormData={updateFormData} />
        <TermsAndConditions />
        <PropertyFormActions
          formData={formData}
          onPreview={handlePreview}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default ListProperty;
