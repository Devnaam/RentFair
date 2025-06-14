
export interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalInquiries: number;
  monthlyRevenue: number;
  totalViews: number;
  newInquiries: number;
  activeProperties: number;
}

export interface PropertyListing {
  id: string;
  title: string;
  property_type: string;
  city: string;
  state: string;
  monthly_rent: number;
  status: string;
  created_at: string;
  photos: string[];
}

export interface PropertyWithStats {
  id: string;
  title: string;
  location: string;
  rent: number;
  status: 'active' | 'inactive' | 'rented' | 'pending_review' | 'draft';
  views: number;
  inquiries: number;
  rating: number;
  reviews: number;
  photos?: string[];
}
