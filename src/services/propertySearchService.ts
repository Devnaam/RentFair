
import { supabase } from '@/integrations/supabase/client';

export interface PropertySearchFilters {
  location?: string;
  propertyType?: string;
  minRent?: number;
  maxRent?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  furnishingStatus?: string;
  availableFrom?: string;
  brokerFree?: boolean;
  city?: string;
  state?: string;
  limit?: number;
  offset?: number;
}

export interface PropertySearchResult {
  id: string;
  title: string | null;
  property_type: string;
  street_address: string;
  city: string;
  state: string;
  pincode: string;
  monthly_rent: number;
  security_deposit: number;
  bedrooms: number | null;
  bathrooms: number | null;
  size_sqft: number | null;
  furnishing_status: string;
  amenities: string[] | null;
  utilities_included: string[] | null;
  photos: string[] | null;
  video_tour_url: string | null;
  availability_date: string;
  views_count: number | null;
  broker_free: boolean | null;
  created_at: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface PropertySearchResponse {
  data: PropertySearchResult[];
  total: number;
  hasMore: boolean;
}

/**
 * Search properties in Supabase based on various filters
 * @param filters - The search criteria
 * @returns Promise with search results
 */
export const searchProperties = async (
  filters: PropertySearchFilters = {}
): Promise<PropertySearchResponse> => {
  try {
    console.log('Searching properties with filters:', filters);
    
    // Start building the query
    let query = supabase
      .from('property_listings')
      .select('*', { count: 'exact' })
      .eq('status', 'active');

    // Location filters (city or state)
    if (filters.location) {
      query = query.or(
        `city.ilike.%${filters.location}%,state.ilike.%${filters.location}%,street_address.ilike.%${filters.location}%`
      );
    }

    // Specific city filter
    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    // Specific state filter
    if (filters.state) {
      query = query.ilike('state', `%${filters.state}%`);
    }

    // Property type filter
    if (filters.propertyType) {
      const validPropertyTypes = [
        'single_room', 'shared_room', 'full_flat_1bhk', 
        'full_flat_2bhk', 'pg_hostel_room', 'full_flat_3bhk_plus'
      ];
      
      if (validPropertyTypes.includes(filters.propertyType)) {
        query = query.eq('property_type', filters.propertyType);
      }
    }

    // Rent range filters
    if (filters.minRent !== undefined) {
      query = query.gte('monthly_rent', filters.minRent);
    }

    if (filters.maxRent !== undefined) {
      query = query.lte('monthly_rent', filters.maxRent);
    }

    // Bedroom filter
    if (filters.bedrooms !== undefined) {
      query = query.eq('bedrooms', filters.bedrooms);
    }

    // Bathroom filter
    if (filters.bathrooms !== undefined) {
      query = query.eq('bathrooms', filters.bathrooms);
    }

    // Furnishing status filter
    if (filters.furnishingStatus) {
      const validFurnishingStatus = ['unfurnished', 'semi_furnished', 'fully_furnished'];
      if (validFurnishingStatus.includes(filters.furnishingStatus)) {
        query = query.eq('furnishing_status', filters.furnishingStatus);
      }
    }

    // Amenities filter (contains any of the specified amenities)
    if (filters.amenities && filters.amenities.length > 0) {
      query = query.overlaps('amenities', filters.amenities);
    }

    // Availability date filter
    if (filters.availableFrom) {
      query = query.lte('availability_date', filters.availableFrom);
    }

    // Broker free filter
    if (filters.brokerFree !== undefined) {
      query = query.eq('broker_free', filters.brokerFree);
    }

    // Pagination
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    
    query = query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      console.error('Error searching properties:', error);
      throw new Error(`Failed to search properties: ${error.message}`);
    }

    const total = count || 0;
    const hasMore = offset + limit < total;

    return {
      data: data || [],
      total,
      hasMore
    };

  } catch (error) {
    console.error('Property search service error:', error);
    throw error;
  }
};

/**
 * Get a single property by ID
 * @param propertyId - The property ID
 * @returns Promise with property data
 */
export const getPropertyById = async (
  propertyId: string
): Promise<PropertySearchResult | null> => {
  try {
    const { data, error } = await supabase
      .from('property_listings')
      .select('*')
      .eq('id', propertyId)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      console.error('Error fetching property:', error);
      throw new Error(`Failed to fetch property: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Get property by ID error:', error);
    throw error;
  }
};

/**
 * Get properties by location (city/state)
 * @param location - City or state name
 * @param limit - Number of results to return
 * @returns Promise with properties in the location
 */
export const getPropertiesByLocation = async (
  location: string,
  limit: number = 10
): Promise<PropertySearchResult[]> => {
  try {
    const { data, error } = await supabase
      .from('property_listings')
      .select('*')
      .eq('status', 'active')
      .or(`city.ilike.%${location}%,state.ilike.%${location}%`)
      .order('views_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching properties by location:', error);
      throw new Error(`Failed to fetch properties: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Get properties by location error:', error);
    throw error;
  }
};

/**
 * Get featured/popular properties
 * @param limit - Number of results to return
 * @returns Promise with featured properties
 */
export const getFeaturedProperties = async (
  limit: number = 6
): Promise<PropertySearchResult[]> => {
  try {
    const { data, error } = await supabase
      .from('property_listings')
      .select('*')
      .eq('status', 'active')
      .order('views_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured properties:', error);
      throw new Error(`Failed to fetch featured properties: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Get featured properties error:', error);
    throw error;
  }
};
