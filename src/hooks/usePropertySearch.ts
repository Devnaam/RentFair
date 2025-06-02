
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  searchProperties, 
  PropertySearchFilters, 
  PropertySearchResult,
  PropertySearchResponse 
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

  const convertFiltersToSearchFilters = (searchFilters: SearchFilters): PropertySearchFilters => {
    const propertySearchFilters: PropertySearchFilters = {};

    if (searchFilters.location) {
      propertySearchFilters.location = searchFilters.location;
    }

    if (searchFilters.propertyType) {
      propertySearchFilters.propertyType = searchFilters.propertyType;
    }

    if (searchFilters.budget) {
      const maxRent = getBudgetMaxValue(searchFilters.budget);
      if (maxRent) {
        propertySearchFilters.maxRent = maxRent;
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
    queryFn: () => searchProperties(convertFiltersToSearchFilters(filters)),
    enabled: false // Only run when explicitly triggered
  });

  const executeSearch = (newFilters: SearchFilters) => {
    console.log('Executing search with filters:', newFilters);
    setFilters(newFilters);
    refetch();
  };

  return {
    properties: searchResponse?.data || [],
    total: searchResponse?.total || 0,
    hasMore: searchResponse?.hasMore || false,
    isLoading,
    error,
    executeSearch,
    filters
  };
};

export default usePropertySearch;
