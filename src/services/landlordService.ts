
import { supabase } from '@/integrations/supabase/client';
import { DashboardStats, PropertyListing, PropertyWithStats } from './types/dashboard';

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

        // Ensure status is properly typed with fallback
        const validStatuses: Array<'active' | 'inactive' | 'rented' | 'pending_review' | 'draft'> = 
          ['active', 'inactive', 'rented', 'pending_review', 'draft'];
        const status = validStatuses.includes(listing.status as any) ? 
          listing.status as 'active' | 'inactive' | 'rented' | 'pending_review' | 'draft' : 'draft';

        return {
          id: listing.id,
          title: listing.title || `${listing.property_type} in ${listing.city}`,
          location: `${listing.city}, ${listing.state}`,
          rent: listing.monthly_rent,
          status,
          views: listing.views_count || 0,
          inquiries: inquiryCount || 0,
          rating: 4.5,
          reviews: 0,
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

export const fetchLandlordInquiries = async (userId: string) => {
  try {
    console.log('Fetching detailed inquiries for landlord:', userId);
    
    const { data, error } = await supabase
      .from('property_inquiries')
      .select(`
        id,
        message,
        created_at,
        updated_at,
        listing_id,
        tenant_id,
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
        )
      `)
      .eq('property_listings.landlord_id', userId)
      .order('created_at', { ascending: false });
    
    console.log('Inquiries query result:', { data, error, userId });
    
    if (error) {
      console.error('Error fetching detailed inquiries:', error);
      throw error;
    }

    // Now fetch tenant profiles and replies for each inquiry
    const inquiriesWithProfilesAndReplies = await Promise.all(
      (data || []).map(async (inquiry) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, email, phone')
          .eq('id', inquiry.tenant_id)
          .single();

        // Fetch replies for this inquiry
        const { data: repliesData } = await supabase
          .from('inquiry_replies')
          .select('*')
          .eq('inquiry_id', inquiry.id)
          .order('created_at', { ascending: true });

        return {
          ...inquiry,
          profiles: profile || { name: null, email: null, phone: null },
          replies: repliesData || []
        };
      })
    );
    
    console.log('Final inquiries with profiles and replies:', inquiriesWithProfilesAndReplies);
    return inquiriesWithProfilesAndReplies;
  } catch (error) {
    console.error('Error in fetchLandlordInquiries:', error);
    throw error;
  }
};
