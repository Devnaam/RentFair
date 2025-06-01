import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import PropertyInfoForm from '@/components/listing/PropertyInfoForm';
import RentFeesForm from '@/components/listing/RentFeesForm';
import PhotosVideoForm from '@/components/listing/PhotosVideoForm';
import AmenitiesForm from '@/components/listing/AmenitiesForm';
import ListingPreview from '@/components/listing/ListingPreview';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface ListingFormData {
  // Property Information
  property_type: string;
  street_address: string;
  city: string;
  state: string;
  pincode: string;
  size_sqft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  furnishing_status: string;
  furnished_items: string[];
  house_rules: string;
  minimum_stay_months: number;
  maximum_stay_months: number | null;
  flexibility_notes: string;
  availability_date: string;
  broker_free: boolean;
  
  // Rent & Fees
  monthly_rent: number | null;
  security_deposit: number | null;
  utilities_included: string[];
  additional_fees: { fee_name: string; amount: number; frequency: string }[];
  
  // Media
  photos: string[];
  video_tour_url: string;
  
  // Amenities
  amenities: string[];
}

const ListProperty = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.user_metadata?.role !== 'landlord') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-gray-600">Only landlords can list properties.</p>
            <Button className="mt-4" onClick={() => window.history.back()}>
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

  const validateForm = (): boolean => {
    const required = [
      'property_type', 'street_address', 'city', 'state', 'pincode',
      'furnishing_status', 'availability_date', 'monthly_rent', 'security_deposit'
    ];
    
    for (const field of required) {
      if (!formData[field as keyof ListingFormData]) {
        toast({
          variant: "destructive",
          title: "Missing Required Fields",
          description: `Please fill in all required fields including ${field.replace('_', ' ')}.`
        });
        return false;
      }
    }
    
    if (formData.photos.length < 3) {
      toast({
        variant: "destructive",
        title: "Photos Required",
        description: "Please upload at least 3 photos of your property."
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!isDraft && !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Insert main listing - removing landlord_id as it will be set by RLS policy
      const { data: listing, error: listingError } = await supabase
        .from('property_listings')
        .insert({
          property_type: formData.property_type,
          street_address: formData.street_address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          size_sqft: formData.size_sqft,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          furnishing_status: formData.furnishing_status,
          furnished_items: formData.furnished_items,
          house_rules: formData.house_rules,
          minimum_stay_months: formData.minimum_stay_months,
          maximum_stay_months: formData.maximum_stay_months,
          flexibility_notes: formData.flexibility_notes,
          availability_date: formData.availability_date,
          broker_free: formData.broker_free,
          monthly_rent: formData.monthly_rent,
          security_deposit: formData.security_deposit,
          utilities_included: formData.utilities_included,
          amenities: formData.amenities,
          photos: formData.photos,
          video_tour_url: formData.video_tour_url,
          status: isDraft ? 'draft' : 'active'
        })
        .select()
        .single();

      if (listingError) throw listingError;

      // Insert additional fees if any
      if (formData.additional_fees.length > 0) {
        const { error: feesError } = await supabase
          .from('listing_additional_fees')
          .insert(
            formData.additional_fees.map(fee => ({
              listing_id: listing.id,
              fee_name: fee.fee_name,
              amount: fee.amount,
              frequency: fee.frequency
            }))
          );

        if (feesError) throw feesError;
      }

      toast({
        title: "Success!",
        description: isDraft 
          ? "Your property listing has been saved as a draft."
          : "Your property listing has been published successfully!"
      });

      // Redirect to dashboard (we'll create this later)
      window.location.href = '/dashboard';
      
    } catch (error: any) {
      console.error('Error creating listing:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create listing. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showPreview) {
    return <ListingPreview formData={formData} onBack={() => setShowPreview(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                onClick={() => setShowPreview(true)}
                disabled={!formData.property_type}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary-dark"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PropertyInfoForm formData={formData} updateFormData={updateFormData} />
        <RentFeesForm formData={formData} updateFormData={updateFormData} />
        <PhotosVideoForm formData={formData} updateFormData={updateFormData} />
        <AmenitiesForm formData={formData} updateFormData={updateFormData} />
        
        {/* Terms & Conditions */}
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
      </div>
    </div>
  );
};

export default ListProperty;
