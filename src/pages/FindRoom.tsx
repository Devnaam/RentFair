
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import SearchResults from '@/components/SearchResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthModal from '@/components/AuthModal';
import usePropertySearch, { SearchFilters } from '@/hooks/usePropertySearch';
import { getFeaturedProperties, getAllActiveProperties } from '@/services/propertySearchService';
import { useQuery } from '@tanstack/react-query';

const FindRoom = () => {
  const [searchParams] = useSearchParams();
  const { properties, isLoading, error, executeSearch, loadPropertiesForLocation } = usePropertySearch();
  
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    type: 'login' | 'signup';
  }>({
    isOpen: false,
    type: 'login'
  });

  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get('location') || '',
    propertyType: searchParams.get('propertyType') || '',
    budget: searchParams.get('budget') || '',
    amenities: []
  });

  const [hasSearched, setHasSearched] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');

  // Load all active properties when no search has been performed
  const { data: allProperties, isLoading: loadingAll } = useQuery({
    queryKey: ['allActiveProperties'],
    queryFn: () => getAllActiveProperties(20),
    enabled: !hasSearched && !isLoading
  });

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, type });
  };

  const closeAuthModal = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  const handleSearch = () => {
    console.log('Executing search with filters:', filters);
    executeSearch(filters);
    setHasSearched(true);
  };

  // Get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Use reverse geocoding to get city name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const city = data.city || data.locality || 'Unknown';
            setUserLocation(city);
            console.log('User location detected:', city);
            
            // Auto-set location filter if no location is already set
            if (!filters.location && city !== 'Unknown') {
              setFilters(prev => ({ ...prev, location: city }));
            }
          } catch (error) {
            console.error('Error getting location name:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Auto-search if URL parameters are present
  useEffect(() => {
    const hasUrlParams = searchParams.get('location') || searchParams.get('propertyType') || searchParams.get('budget');
    if (hasUrlParams && !hasSearched) {
      console.log('Auto-searching with URL params');
      handleSearch();
    }
  }, [searchParams, hasSearched]);

  // Get user location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Auto-search when user location is detected and no search has been performed
  useEffect(() => {
    if (userLocation && !hasSearched && !searchParams.get('location') && userLocation !== 'Unknown') {
      console.log('Auto-searching with user location:', userLocation);
      setTimeout(() => {
        executeSearch({ ...filters, location: userLocation });
        setHasSearched(true);
      }, 1000);
    }
  }, [userLocation]);

  const displayProperties = hasSearched ? properties : (allProperties || []);
  const displayLoading = hasSearched ? isLoading : loadingAll;

  const hasFiltersApplied = filters.location || filters.propertyType || filters.budget;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthClick={handleAuthClick} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              Find Your Perfect Room
              {userLocation && userLocation !== 'Unknown' && (
                <span className="text-sm font-normal text-gray-600 block mt-1">
                  {hasSearched ? `Search results ${filters.location ? `for ${filters.location}` : ''}` : `Showing properties near ${userLocation}`}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter city or area"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select value={filters.propertyType} onValueChange={(value) => setFilters({ ...filters, propertyType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single_room">Single Room</SelectItem>
                    <SelectItem value="full_flat_1bhk">1 BHK</SelectItem>
                    <SelectItem value="full_flat_2bhk">2 BHK</SelectItem>
                    <SelectItem value="full_flat_3bhk_plus">3+ BHK</SelectItem>
                    <SelectItem value="pg_hostel_room">PG/Hostel</SelectItem>
                    <SelectItem value="shared_room">Shared Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Select value={filters.budget} onValueChange={(value) => setFilters({ ...filters, budget: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-5000">Under ₹5,000</SelectItem>
                    <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                    <SelectItem value="10000-15000">₹10,000 - ₹15,000</SelectItem>
                    <SelectItem value="15000-25000">₹15,000 - ₹25,000</SelectItem>
                    <SelectItem value="25000+">₹25,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full" disabled={displayLoading}>
                  {displayLoading ? 'Searching...' : 'Search Properties'}
                </Button>
              </div>
            </div>
            
            {hasFiltersApplied && (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setFilters({ location: '', propertyType: '', budget: '', amenities: [] });
                    setHasSearched(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        <SearchResults 
          properties={displayProperties} 
          isLoading={displayLoading} 
          error={error}
          title={hasSearched ? 'Search Results' : (userLocation && userLocation !== 'Unknown' ? `Properties near ${userLocation}` : 'Available Properties')}
        />

        {/* Message when no properties are found */}
        {!displayLoading && displayProperties.length === 0 && !error && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {hasSearched ? 'No properties found' : 'No properties available'}
            </h2>
            <p className="text-gray-600 mb-6">
              {hasSearched 
                ? 'Try adjusting your search filters or search in a different area.' 
                : 'Check back later for new listings.'
              }
            </p>
            {hasSearched && (
              <Button 
                onClick={() => {
                  setFilters({ location: '', propertyType: '', budget: '', amenities: [] });
                  setHasSearched(false);
                }}
                variant="outline"
              >
                View All Properties
              </Button>
            )}
          </div>
        )}
      </div>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialType={authModal.type}
      />
    </div>
  );
};

export default FindRoom;
