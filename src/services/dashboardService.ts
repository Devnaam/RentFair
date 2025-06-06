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
  photos?: string[];
}

// Define valid statuses and ensure type safety
const validStatuses = ['active', 'inactive', 'rented', 'pending_review', 'draft'] as const;
type ValidStatus = typeof validStatuses[number];

const getValidStatus = (status: any): ValidStatus => {
  if (typeof status === 'string' && validStatuses.includes(status as ValidStatus)) {
    return status as ValidStatus;
  }
  return 'draft';
};

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
        updated_at,
        photos
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

        return {
          id: property.id,
          title: property.title || 'Untitled Property',
          location: `${property.street_address}, ${property.city}, ${property.state}`,
          rent: property.monthly_rent || 0,
          status: getValidStatus(property.status),
          views: property.views_count || 0,
          inquiries: inquiriesCount || 0,
          rating: 4.5, // Mock rating
          reviews: Math.floor(Math.random() * 20), // Mock reviews
          created_at: property.created_at,
          updated_at: property.updated_at,
          photos: property.photos || []
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

export const updatePropertyStatus = async (propertyId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('property_listings')
      .update({ 
        status: status as 'active' | 'inactive' | 'rented' | 'pending_review' | 'draft',
        updated_at: new Date().toISOString()
      })
      .eq('id', propertyId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating property status:', error);
    return { data: null, error: error as Error };
  }
};

// Function to increment property views
export const incrementPropertyViews = async (propertyId: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('increment_property_views', {
      property_id: propertyId
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error incrementing property views:', error);
    // Don't throw error for view tracking failures
  }
};

// New function to get a sample property for the homepage
export const fetchSampleProperty = async (): Promise<PropertyWithStats | null> => {
  try {
    const { data: property, error } = await supabase
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
        updated_at,
        photos,
        landlord_id
      `)
      .eq('status', 'active')
      .limit(1)
      .single();

    if (error || !property) return null;

    // Get inquiries count
    const { count: inquiriesCount } = await supabase
      .from('property_inquiries')
      .select('id', { count: 'exact' })
      .eq('listing_id', property.id);

    return {
      id: property.id,
      title: property.title || 'Untitled Property',
      location: `${property.street_address}, ${property.city}, ${property.state}`,
      rent: property.monthly_rent || 0,
      status: getValidStatus(property.status),
      views: property.views_count || 0,
      inquiries: inquiriesCount || 0,
      rating: 4.5,
      reviews: Math.floor(Math.random() * 20),
      created_at: property.created_at,
      updated_at: property.updated_at,
      photos: property.photos || []
    };
  } catch (error) {
    console.error('Error fetching sample property:', error);
    return null;
  }
};

// New function to get a random property for rotation
export const fetchRandomProperty = async (): Promise<PropertyWithStats | null> => {
  try {
    // Get count of active properties first
    const { count } = await supabase
      .from('property_listings')
      .select('id', { count: 'exact' })
      .eq('status', 'active');

    if (!count || count === 0) return null;

    // Get a random offset
    const randomOffset = Math.floor(Math.random() * count);

    const { data: property, error } = await supabase
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
        updated_at,
        photos,
        landlord_id
      `)
      .eq('status', 'active')
      .range(randomOffset, randomOffset)
      .single();

    if (error || !property) return null;

    // Get inquiries count
    const { count: inquiriesCount } = await supabase
      .from('property_inquiries')
      .select('id', { count: 'exact' })
      .eq('listing_id', property.id);

    return {
      id: property.id,
      title: property.title || 'Untitled Property',
      location: `${property.street_address}, ${property.city}, ${property.state}`,
      rent: property.monthly_rent || 0,
      status: getValidStatus(property.status),
      views: property.views_count || 0,
      inquiries: inquiriesCount || 0,
      rating: 4.5,
      reviews: Math.floor(Math.random() * 20),
      created_at: property.created_at,
      updated_at: property.updated_at,
      photos: property.photos || []
    };
  } catch (error) {
    console.error('Error fetching random property:', error);
    return null;
  }
};
