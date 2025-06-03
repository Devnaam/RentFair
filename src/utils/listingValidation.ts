
import { ListingFormData } from '@/types/listing';

export const validateForm = (formData: ListingFormData): { isValid: boolean; message?: string } => {
  // Required fields validation
  const requiredFields = [
    { field: 'property_type', label: 'Property Type' },
    { field: 'street_address', label: 'Street Address' },
    { field: 'city', label: 'City' },
    { field: 'state', label: 'State' },
    { field: 'pincode', label: 'Pincode' },
    { field: 'furnishing_status', label: 'Furnishing Status' },
    { field: 'availability_date', label: 'Availability Date' }
  ];
  
  for (const { field, label } of requiredFields) {
    if (!formData[field as keyof ListingFormData]) {
      return {
        isValid: false,
        message: `Please fill in the ${label} field.`
      };
    }
  }
  
  // Rent validation
  if (!formData.monthly_rent || formData.monthly_rent <= 0) {
    return {
      isValid: false,
      message: "Please enter a valid monthly rent amount."
    };
  }
  
  // Security deposit validation
  if (!formData.security_deposit || formData.security_deposit < 0) {
    return {
      isValid: false,
      message: "Please enter a valid security deposit amount."
    };
  }
  
  // Photos validation
  if (formData.photos.length < 3) {
    return {
      isValid: false,
      message: "Please upload at least 3 photos of your property."
    };
  }
  
  // Video URL validation if provided
  if (formData.video_tour_url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/\d+/;
    if (!youtubeRegex.test(formData.video_tour_url) && !vimeoRegex.test(formData.video_tour_url)) {
      return {
        isValid: false,
        message: "Please enter a valid YouTube or Vimeo URL for the video tour."
      };
    }
  }
  
  return { isValid: true };
};
