
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  searchProperties, 
  PropertySearchFilters, 
  PropertySearchResult,
  PropertySearchResponse,
  getPropertiesByLocation,
  getAllActiveProperties
} from '@/services/propertySearchService';

export interface SearchFilters {
  location: string;
  propertyType: string;
  budget: string;
  maxRent?: number;
  amenities?: string[];
}

export interface Property extends PropertySearchResult {}

const usePropertySearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    propertyType: '',
    budget: ''
  });

  const getBudgetRange = (budget: string): { min?: number; max?: number } => {
    switch (budget) {
      case '0-3000':
        return { min: 0, max: 3000 };
      case '3000-5000':
        return { min: 3000, max: 5000 };
      case '5000-8000':
        return { min: 5000, max: 8000 };
      case '8000-12000':
        return { min: 8000, max: 12000 };
      case '12000-18000':
        return { min: 12000, max: 18000 };
      case '18000-25000':
        return { min: 18000, max: 25000 };
      case '25000-35000':
        return { min: 25000, max: 35000 };
      case '35000-50000':
        return { min: 35000, max: 50000 };
      case '50000+':
        return { min: 50000 };
      // Legacy support for old budget ranges
      case '0-5000':
        return { min: 0, max: 5000 };
      case '5000-10000':
        return { min: 5000, max: 10000 };
      case '10000-15000':
        return { min: 10000, max: 15000 };
      case '15000-25000':
        return { min: 15000, max: 25000 };
      case '25000+':
        return { min: 25000 };
      default:
        return {};
    }
  };

  const convertFiltersToSearchFilters = (searchFilters: SearchFilters): PropertySearchFilters => {
    const propertySearchFilters: PropertySearchFilters = {};

    if (searchFilters.location) {
      propertySearchFilters.location = searchFilters.location;
    }

    if (searchFilters.propertyType) {
      propertySearchFilters.propertyType = searchFilters.propertyType;
    }

    if (searchFilters.budget) {
      const budgetRange = getBudgetRange(searchFilters.budget);
      if (budgetRange.min !== undefined) {
        propertySearchFilters.minRent = budgetRange.min;
      }
      if (budgetRange.max !== undefined) {
        propertySearchFilters.maxRent = budgetRange.max;
      }
    }

    if (searchFilters.amenities && searchFilters.amenities.length > 0) {
      propertySearchFilters.amenities = searchFilters.amenities;
    }

    return propertySearchFilters;
  };

  const {
    data: searchResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const searchFilters = convertFiltersToSearchFilters(filters);
      console.log('Converting filters:', filters, 'to:', searchFilters);
      
      // If no filters are applied, get all active properties
      if (!searchFilters.location && !searchFilters.propertyType && !searchFilters.minRent && !searchFilters.maxRent) {
        console.log('No filters applied, fetching all active properties');
        const properties = await getAllActiveProperties(20);
        return {
          data: properties,
          total: properties.length,
          hasMore: false
        };
      }
      
      return searchProperties(searchFilters);
    },
    enabled: false // Only run when explicitly triggered
  });

  const executeSearch = (newFilters: SearchFilters) => {
    console.log('Executing search with filters:', newFilters);
    setFilters(newFilters);
    refetch();
  };

  // Auto-load properties for a location
  const loadPropertiesForLocation = async (location: string) => {
    try {
      console.log('Loading properties for location:', location);
      const properties = await getPropertiesByLocation(location, 20);
      return properties;
    } catch (error) {
      console.error('Error loading properties for location:', error);
      throw error;
    }
  };

  return {
    properties: searchResponse?.data || [],
    total: searchResponse?.total || 0,
    hasMore: searchResponse?.hasMore || false,
    isLoading,
    error,
    executeSearch,
    loadPropertiesForLocation,
    filters
  };
};

export default usePropertySearch;
