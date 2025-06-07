
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
  status: 'active' | 'inactive' | 'rented' | 'pending_review' | 'draft';
  views: number;
  inquiries: number;
  rating: number;
  reviews: number;
  photos?: string[];
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

    // Fetch total inquiries for landlord's properties
    const { count: totalInquiries } = await supabase
      .from('property_inquiries')
      .select(`
        *,
        property_listings!inner(landlord_id)
      `, { count: 'exact', head: true })
      .eq('property_listings.landlord_id', userId);

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

    // Get inquiry counts for each property
    const propertiesWithStats = await Promise.all(
      (data || []).map(async (listing) => {
        // Count inquiries for this property
        const { count: inquiryCount } = await supabase
          .from('property_inquiries')
          .select('*', { count: 'exact', head: true })
          .eq('listing_id', listing.id);

        return {
          id: listing.id,
          title: listing.title || `${listing.property_type} in ${listing.city}`,
          location: `${listing.city}, ${listing.state}`,
          rent: listing.monthly_rent,
          status: (listing.status || 'draft') as 'active' | 'inactive' | 'rented' | 'pending_review' | 'draft',
          views: listing.views_count || 0,
          inquiries: inquiryCount || 0,
          rating: 4.5, // This would need to be calculated from reviews
          reviews: 0, // This would need to be calculated from reviews table
          photos: Array.isArray(listing.photos) ? listing.photos : []
        };
      })
    );

    return propertiesWithStats;
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
  try {
    // First get the current views count
    const { data: currentData } = await supabase
      .from('property_listings')
      .select('views_count')
      .eq('id', propertyId)
      .single();

    const currentViews = currentData?.views_count || 0;

    // Then update with incremented value
    const { error } = await supabase
      .from('property_listings')
      .update({ views_count: currentViews + 1 })
      .eq('id', propertyId);

    if (error) console.error('Error incrementing views:', error);
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
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
      status: (data.status || 'active') as 'active' | 'inactive' | 'rented' | 'pending_review' | 'draft',
      views: data.views_count || 0,
      inquiries: 0,
      rating: 4.5,
      reviews: 0,
      photos: Array.isArray(data.photos) ? data.photos : []
    };
  } catch (error) {
    console.error('Error fetching random property:', error);
    return null;
  }
};

// New function to fetch detailed inquiries for landlord
export const fetchLandlordInquiries = async (userId: string) => {
  try {
    console.log('Fetching detailed inquiries for landlord:', userId);
    
    const { data, error } = await supabase
      .from('property_inquiries')
      .select(`
        *,
        property_listings!inner(
          id,
          title,
          street_address,
          city,
          state,
          monthly_rent,
          photos,
          bedrooms,
          bathrooms,
          views_count,
          landlord_id
        ),
        profiles!property_inquiries_tenant_id_fkey(
          name,
          email,
          phone
        )
      `)
      .eq('property_listings.landlord_id', userId)
      .order('created_at', { ascending: false });
    
    console.log('Detailed inquiries query result:', { data, error, userId });
    
    if (error) {
      console.error('Error fetching detailed inquiries:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchLandlordInquiries:', error);
    throw error;
  }
};
