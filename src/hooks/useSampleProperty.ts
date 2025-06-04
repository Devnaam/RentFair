
import { useEffect, useState, useCallback } from 'react';
import { fetchRandomProperty, PropertyWithStats } from '@/services/dashboardService';
import { toast } from '@/hooks/use-toast';

export const useSampleProperty = () => {
  const [property, setProperty] = useState<PropertyWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache key for localStorage
  const CACHE_KEY = 'sample_property_cache';
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  const getCachedProperty = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  }, []);

  const setCachedProperty = useCallback((propertyData: PropertyWithStats) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: propertyData,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }, []);

  const loadProperty = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Try to get cached data first
    const cachedProperty = getCachedProperty();
    if (cachedProperty) {
      setProperty(cachedProperty);
      setLoading(false);
      return;
    }

    try {
      const propertyData = await fetchRandomProperty();
      if (propertyData) {
        setProperty(propertyData);
        setCachedProperty(propertyData);
      } else {
        setError('No properties available to display');
      }
    } catch (error) {
      console.error('Error loading sample property:', error);
      setError('Failed to load property data');
      toast({
        variant: "destructive",
        title: "Error loading property",
        description: "Failed to load property data. Please try again later."
      });
    } finally {
      setLoading(false);
    }
  }, [getCachedProperty, setCachedProperty]);

  const rotateProperty = useCallback(() => {
    // Clear cache and load new property
    localStorage.removeItem(CACHE_KEY);
    loadProperty();
  }, [loadProperty]);

  useEffect(() => {
    loadProperty();
  }, [loadProperty]);

  return {
    property,
    loading,
    error,
    rotateProperty,
    refetch: loadProperty
  };
};
