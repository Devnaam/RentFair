
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ListingFormData } from '@/types/listing';
import { validateForm } from '@/utils/listingValidation';

export const useListingSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (formData: ListingFormData, isDraft: boolean = false) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to create a listing."
      });
      return;
    }

    if (!isDraft) {
      const validation = validateForm(formData);
      if (!validation.isValid) {
        toast({
          variant: "destructive",
          title: "Missing Required Fields",
          description: validation.message
        });
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      // Generate a title if not provided
      const title = `${formData.property_type.replace('_', ' ')} in ${formData.city}`;
      
      // Insert main listing
      const { data: listing, error: listingError } = await supabase
        .from('property_listings')
        .insert({
          landlord_id: user.id,
          title: title,
          property_type: formData.property_type as any,
          street_address: formData.street_address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          size_sqft: formData.size_sqft,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          furnishing_status: formData.furnishing_status as any,
          furnished_items: formData.furnished_items,
          house_rules: formData.house_rules,
          minimum_stay_months: formData.minimum_stay_months,
          maximum_stay_months: formData.maximum_stay_months,
          flexibility_notes: formData.flexibility_notes,
          availability_date: formData.availability_date,
          broker_free: formData.broker_free,
          monthly_rent: formData.monthly_rent || 0,
          security_deposit: formData.security_deposit || 0,
          utilities_included: formData.utilities_included,
          amenities: formData.amenities,
          photos: formData.photos,
          video_tour_url: formData.video_tour_url,
          status: isDraft ? 'draft' : 'active'
        })
        .select()
        .single();

      if (listingError) {
        console.error('Listing error:', listingError);
        throw listingError;
      }

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

        if (feesError) {
          console.error('Fees error:', feesError);
          throw feesError;
        }
      }

      toast({
        title: "Success!",
        description: isDraft 
          ? "Your property listing has been saved as a draft."
          : "Your property listing has been published successfully!"
      });

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
      
    } catch (error: any) {
      console.error('Error creating listing:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create listing. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
