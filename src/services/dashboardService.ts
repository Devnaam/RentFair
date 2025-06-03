
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  monthlyRevenue: number;
  totalViews: number;
  newInquiries: number;
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
  created_at: string;
  updated_at: string;
}

export const fetchDashboardStats = async (landlordId: string): Promise<DashboardStats> => {
  try {
    // Fetch properties
    const { data: properties, error: propertiesError } = await supabase
      .from('property_listings')
      .select('id, monthly_rent, status, views_count')
      .eq('landlord_id', landlordId);

    if (propertiesError) throw propertiesError;

    // Fetch inquiries count
    const { count: inquiriesCount, error: inquiriesError } = await supabase
      .from('property_inquiries')
      .select('id', { count: 'exact' })
      .in('listing_id', properties?.map(p => p.id) || []);

    if (inquiriesError) throw inquiriesError;

    // Calculate stats
    const totalProperties = properties?.length || 0;
    const activeProperties = properties?.filter(p => p.status === 'active').length || 0;
    const monthlyRevenue = properties
      ?.filter(p => p.status === 'rented')
      .reduce((sum, p) => sum + (p.monthly_rent || 0), 0) || 0;
    const totalViews = properties?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0;
    const newInquiries = inquiriesCount || 0;

    return {
      totalProperties,
      activeProperties,
      monthlyRevenue,
      totalViews,
      newInquiries
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const fetchLandlordProperties = async (landlordId: string): Promise<PropertyWithStats[]> => {
  try {
    const { data: properties, error } = await supabase
      .from('property_listings')
      .select(`
        id,
        title,
        street_address,
        city,
        state,
        monthly_rent,
        status,
        views_count,
        created_at,
        updated_at
      `)
      .eq('landlord_id', landlordId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get inquiries count for each property
    const propertiesWithStats = await Promise.all(
      (properties || []).map(async (property) => {
        const { count: inquiriesCount } = await supabase
          .from('property_inquiries')
          .select('id', { count: 'exact' })
          .eq('listing_id', property.id);

        // Ensure the status is one of the allowed values with proper type assertion
        const validStatuses = ['active', 'inactive', 'rented', 'pending_review', 'draft'] as const;
        const status: 'active' | 'inactive' | 'rented' | 'pending_review' | 'draft' = 
          validStatuses.includes(property.status as any) 
            ? property.status as 'active' | 'inactive' | 'rented' | 'pending_review' | 'draft'
            : 'draft';

        return {
          id: property.id,
          title: property.title || 'Untitled Property',
          location: `${property.street_address}, ${property.city}, ${property.state}`,
          rent: property.monthly_rent || 0,
          status,
          views: property.views_count || 0,
          inquiries: inquiriesCount || 0,
          rating: 4.5, // Mock rating
          reviews: Math.floor(Math.random() * 20), // Mock reviews
          created_at: property.created_at,
          updated_at: property.updated_at
        };
      })
    );

    return propertiesWithStats;
  } catch (error) {
    console.error('Error fetching landlord properties:', error);
    throw error;
  }
};

export const deleteProperty = async (propertyId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('property_listings')
      .delete()
      .eq('id', propertyId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};

export const updatePropertyStatus = async (propertyId: string, status: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('property_listings')
      .update({ status })
      .eq('id', propertyId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating property status:', error);
    throw error;
  }
};
