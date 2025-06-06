
import { supabase } from '@/integrations/supabase/client';

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
  status: string;
  views: number;
  inquiries: number;
  rating: number;
  reviews: number;
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

    // Fetch total inquiries - using correct table name
    const { count: totalInquiries } = await supabase
      .from('property_inquiries')
      .select('*', { count: 'exact', head: true });

    return {
      totalListings: totalListings || 0,
      activeListings: activeListings || 0,
      totalInquiries: totalInquiries || 0,
      monthlyRevenue: 0,
      totalViews: 0,
      newInquiries: totalInquiries || 0,
      activeProperties: activeListings || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalListings: 0,
      activeListings: 0,
      totalInquiries: 0,
      monthlyRevenue: 0,
      totalViews: 0,
      newInquiries: 0,
      activeProperties: 0,
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

export const fetchLandlordProperties = async (userId: string): Promise<PropertyWithStats[]> => {
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
      location: `${listing.city}, ${listing.state}`,
      rent: listing.monthly_rent,
      status: listing.status,
      views: listing.views_count || 0,
      inquiries: 0, // This would need to be calculated from inquiries table
      rating: 4.5, // This would need to be calculated from reviews
      reviews: 0, // This would need to be calculated from reviews table
    }));
  } catch (error) {
    console.error('Error fetching landlord properties:', error);
    return [];
  }
};

export const deleteProperty = async (propertyId: string): Promise<void> => {
  const { error } = await supabase
    .from('property_listings')
    .delete()
    .eq('id', propertyId);

  if (error) throw error;
};

export const updatePropertyStatus = async (propertyId: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('property_listings')
    .update({ status })
    .eq('id', propertyId);

  if (error) throw error;
};

export const incrementPropertyViews = async (propertyId: string): Promise<void> => {
  const { error } = await supabase
    .from('property_listings')
    .update({ views_count: supabase.rpc('increment', { x: 1 }) })
    .eq('id', propertyId);

  if (error) console.error('Error incrementing views:', error);
};

export const fetchRandomProperty = async (): Promise<PropertyWithStats | null> => {
  try {
    const { data, error } = await supabase
      .from('property_listings')
      .select('*')
      .eq('status', 'active')
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      title: data.title || `${data.property_type} in ${data.city}`,
      location: `${data.city}, ${data.state}`,
      rent: data.monthly_rent,
      status: data.status,
      views: data.views_count || 0,
      inquiries: 0,
      rating: 4.5,
      reviews: 0,
    };
  } catch (error) {
    console.error('Error fetching random property:', error);
    return null;
  }
};
