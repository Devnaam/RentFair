
import { ListingFormData } from '@/types/listing';

export const validateForm = (formData: ListingFormData): { isValid: boolean; message?: string } => {
  const required = [
    'property_type', 'street_address', 'city', 'state', 'pincode',
    'furnishing_status', 'availability_date', 'monthly_rent', 'security_deposit'
  ];
  
  for (const field of required) {
    if (!formData[field as keyof ListingFormData]) {
      return {
        isValid: false,
        message: `Please fill in all required fields including ${field.replace('_', ' ')}.`
      };
    }
  }
  
  if (formData.photos.length < 3) {
    return {
      isValid: false,
      message: "Please upload at least 3 photos of your property."
    };
  }
  
  return { isValid: true };
};
