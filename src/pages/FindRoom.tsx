
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
import { getFeaturedProperties } from '@/services/propertySearchService';
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

  // Load featured properties when no search has been performed
  const { data: featuredProperties, isLoading: loadingFeatured } = useQuery({
    queryKey: ['featuredProperties'],
    queryFn: () => getFeaturedProperties(12),
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
            
            // Auto-load properties for user's location
            if (city !== 'Unknown') {
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
      handleSearch();
    }
  }, [searchParams, hasSearched]);

  // Get user location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Auto-search when user location is detected
  useEffect(() => {
    if (userLocation && !hasSearched && !searchParams.get('location')) {
      setFilters(prev => ({ ...prev, location: userLocation }));
      setTimeout(() => {
        executeSearch({ ...filters, location: userLocation });
        setHasSearched(true);
      }, 1000);
    }
  }, [userLocation]);

  const displayProperties = hasSearched ? properties : (featuredProperties || []);
  const displayLoading = hasSearched ? isLoading : loadingFeatured;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthClick={handleAuthClick} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              Find Your Perfect Room
              {userLocation && (
                <span className="text-sm font-normal text-gray-600 block mt-1">
                  Showing properties near {userLocation}
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
          </CardContent>
        </Card>

        {/* Search Results */}
        <SearchResults 
          properties={displayProperties} 
          isLoading={displayLoading} 
          error={error}
          title={hasSearched ? 'Search Results' : 'Featured Properties'}
        />

        {/* Default message when no search has been performed and no featured properties */}
        {!hasSearched && !loadingFeatured && (!featuredProperties || featuredProperties.length === 0) && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find Your Perfect Room?</h2>
            <p className="text-gray-600 mb-6">Use the search filters above to discover properties that match your needs.</p>
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
