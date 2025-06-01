
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
