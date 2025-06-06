
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalInquiries: number;
  monthlyRevenue: number;
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

export const fetchDashboardStats = async (userId: string): Promise<DashboardStats> => {
  try {
    // Fetch total listings
    const { count: totalListings } = await supabase
      .from('property_listings')
      .select('*', { count: 'exact', head: true })
      .eq('landlord_id', userId);

    // Fetch active listings
    const { count: activeListings } = await supabase
      .from('property_listings')
      .select('*', { count: 'exact', head: true })
      .eq('landlord_id', userId)
      .eq('status', 'active');

    // Fetch total inquiries (assuming there's an inquiries table)
    const { count: totalInquiries } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('landlord_id', userId);

    return {
      totalListings: totalListings || 0,
      activeListings: activeListings || 0,
      totalInquiries: totalInquiries || 0,
      monthlyRevenue: 0, // This would need actual revenue calculation
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalListings: 0,
      activeListings: 0,
      totalInquiries: 0,
      monthlyRevenue: 0,
    };
  }
};

export const fetchUserListings = async (userId: string): Promise<PropertyListing[]> => {
  try {
    const { data, error } = await supabase
      .from('property_listings')
      .select('*')
      .eq('landlord_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(listing => ({
      id: listing.id,
      title: listing.title || `${listing.property_type} in ${listing.city}`,
      property_type: listing.property_type,
      city: listing.city,
      state: listing.state,
      monthly_rent: listing.monthly_rent,
      status: listing.status,
      created_at: listing.created_at,
      photos: Array.isArray(listing.photos) ? listing.photos : []
    }));
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return [];
  }
};
