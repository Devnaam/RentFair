
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SearchFilters {
  location: string;
  propertyType: string;
  budget: string;
  maxRent?: number;
  amenities?: string[];
}

export interface Property {
  id: string;
  title: string;
  property_type: string;
  street_address: string;
  city: string;
  state: string;
  monthly_rent: number;
  security_deposit: number;
  bedrooms: number | null;
  bathrooms: number | null;
  amenities: string[];
  photos: string[];
  utilities_included: string[];
  furnishing_status: string;
  availability_date: string;
  views_count: number;
  created_at: string;
}

const usePropertySearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    propertyType: '',
    budget: ''
  });

  const searchProperties = async (searchFilters: SearchFilters): Promise<Property[]> => {
    console.log('Searching properties with filters:', searchFilters);
    
    let query = supabase
      .from('property_listings')
      .select('*')
      .eq('status', 'active');

    // Filter by location (city or state)
    if (searchFilters.location) {
      query = query.or(`city.ilike.%${searchFilters.location}%,state.ilike.%${searchFilters.location}%`);
    }

    // Filter by property type - only apply if it's a valid property type
    if (searchFilters.propertyType) {
      const validPropertyTypes = [
        'single_room', 'shared_room', 'full_flat_1bhk', 
        'full_flat_2bhk', 'pg_hostel_room', 'full_flat_3bhk_plus'
      ];
      
      if (validPropertyTypes.includes(searchFilters.propertyType)) {
        query = query.eq('property_type', searchFilters.propertyType);
      }
    }

    // Filter by budget
    if (searchFilters.budget) {
      const maxRent = getBudgetMaxValue(searchFilters.budget);
      if (maxRent) {
        query = query.lte('monthly_rent', maxRent);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching properties:', error);
      throw error;
    }

    return data || [];
  };

  const getBudgetMaxValue = (budget: string): number | null => {
    switch (budget) {
      case '0-5000':
        return 5000;
      case '5000-10000':
        return 10000;
      case '10000-15000':
        return 15000;
      case '15000-25000':
        return 25000;
      case '25000+':
        return null; // No upper limit
      default:
        return null;
    }
  };

  const {
    data: properties = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => searchProperties(filters),
    enabled: false // Only run when explicitly triggered
  });

  const executeSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    refetch();
  };

  return {
    properties,
    isLoading,
    error,
    executeSearch,
    filters
  };
};

export default usePropertySearch;
