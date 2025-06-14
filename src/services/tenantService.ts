
import { supabase } from '@/integrations/supabase/client';

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
