
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

        // Ensure status is properly typed with fallback
        const validStatuses: Array<'active' | 'inactive' | 'rented' | 'pending_review' | 'draft'> = 
          ['active', 'inactive', 'rented', 'pending_review', 'draft'];
        const status = validStatuses.includes(listing.status) ? 
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

    const validStatuses: Array<'active' | 'inactive' | 'rented' | 'pending_review' | 'draft'> = 
      ['active', 'inactive', 'rented', 'pending_review', 'draft'];
    const status = validStatuses.includes(data.status) ? 
      data.status as 'active' | 'inactive' | 'rented' | 'pending_review' | 'draft' : 'active';

    return {
      id: data.id,
      title: data.title || `${data.property_type} in ${data.city}`,
      location: `${data.city}, ${data.state}`,
      rent: data.monthly_rent,
      status,
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

// Function to fetch detailed inquiries for landlord with replies
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

// Function to fetch tenant inquiries with replies
export const fetchTenantInquiries = async (userId: string) => {
  try {
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
      .eq('tenant_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tenant inquiries:', error);
      throw error;
    }

    // Fetch replies for each inquiry
    const inquiriesWithReplies = await Promise.all(
      (data || []).map(async (inquiry) => {
        // Fetch replies for this inquiry
        const { data: repliesData } = await supabase
          .from('inquiry_replies')
          .select('*')
          .eq('inquiry_id', inquiry.id)
          .order('created_at', { ascending: true });

        return {
          ...inquiry,
          replies: repliesData || []
        };
      })
    );

    return inquiriesWithReplies;
  } catch (error) {
    console.error('Error in fetchTenantInquiries:', error);
    throw error;
  }
};

// Function to save a reply to the database
export const saveInquiryReply = async (inquiryId: string, message: string, senderType: 'landlord' | 'tenant') => {
  try {
    const { data, error } = await supabase
      .from('inquiry_replies')
      .insert({
        inquiry_id: inquiryId,
        message,
        sender_type: senderType,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving inquiry reply:', error);
    throw error;
  }
};

// Function to fetch tenant dashboard stats
export const fetchTenantDashboardStats = async (userId: string) => {
  try {
    // Count total inquiries made by tenant
    const { count: totalInquiries } = await supabase
      .from('property_inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', userId);

    // Count active inquiries (recent ones)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: recentInquiries } = await supabase
      .from('property_inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', userId)
      .gte('created_at', sevenDaysAgo.toISOString());

    // Count inquiries with replies (responded inquiries)
    const { data: inquiriesWithReplies } = await supabase
      .from('property_inquiries')
      .select(`
        id
      `)
      .eq('tenant_id', userId);

    // For each inquiry, check if it has replies
    const inquiriesWithRepliesCount = await Promise.all(
      (inquiriesWithReplies || []).map(async (inquiry) => {
        const { count } = await supabase
          .from('inquiry_replies')
          .select('*', { count: 'exact', head: true })
          .eq('inquiry_id', inquiry.id);
        return count && count > 0;
      })
    );

    const respondedInquiries = inquiriesWithRepliesCount.filter(Boolean).length;

    return {
      totalInquiries: totalInquiries || 0,
      recentInquiries: recentInquiries || 0,
      respondedInquiries,
      favoriteProperties: 0, // Can be implemented later
      viewedProperties: 0, // Can be implemented later
    };
  } catch (error) {
    console.error('Error fetching tenant dashboard stats:', error);
    return {
      totalInquiries: 0,
      recentInquiries: 0,
      respondedInquiries: 0,
      favoriteProperties: 0,
      viewedProperties: 0,
    };
  }
};
