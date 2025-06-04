
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
import { getAllActiveProperties } from '@/services/propertySearchService';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Navigation } from 'lucide-react';

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
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Load all active properties from all users when no search has been performed
  const { data: allProperties, isLoading: loadingAll } = useQuery({
    queryKey: ['allActiveProperties'],
    queryFn: () => getAllActiveProperties(50),
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

  // Get user's location with improved accuracy
  const getUserLocation = async () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Use more accurate reverse geocoding with multiple fallbacks
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            console.log('Location coordinates:', { lat, lon });
            
            // Primary API - BigDataCloud (more accurate)
            let response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
            );
            let data = await response.json();
            
            let city = data.city || data.locality || data.principalSubdivision;
            
            // Fallback to OpenStreetMap Nominatim if BigDataCloud fails
            if (!city || city === 'Unknown') {
              try {
                response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
                );
                const osmData = await response.json();
                city = osmData.address?.city || osmData.address?.town || osmData.address?.village || osmData.address?.state;
              } catch (osmError) {
                console.error('OSM Nominatim error:', osmError);
              }
            }
            
            if (city && city !== 'Unknown') {
              setUserLocation(city);
              console.log('User location detected:', city);
              
              // Auto-set location filter if no location is already set
              if (!filters.location) {
                setFilters(prev => ({ ...prev, location: city }));
              }
            } else {
              console.log('Could not determine city name');
              setUserLocation('Location detected');
            }
          } catch (error) {
            console.error('Error getting location name:', error);
            setUserLocation('Location detected');
          } finally {
            setIsGettingLocation(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          // Handle different error types
          switch(error.code) {
            case error.PERMISSION_DENIED:
              console.log('Location access denied by user');
              break;
            case error.POSITION_UNAVAILABLE:
              console.log('Location information unavailable');
              break;
            case error.TIMEOUT:
              console.log('Location request timed out');
              break;
          }
        },
        options
      );
    } else {
      console.log('Geolocation not supported');
      setIsGettingLocation(false);
    }
  };

  // Near Me functionality
  const handleNearMe = () => {
    getUserLocation();
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
    if (userLocation && !hasSearched && !searchParams.get('location') && userLocation !== 'Unknown' && userLocation !== 'Location detected') {
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
              {!hasSearched && (
                <span className="text-sm font-normal text-gray-600 block mt-1">
                  Showing all available properties
                </span>
              )}
              {hasSearched && userLocation && userLocation !== 'Unknown' && (
                <span className="text-sm font-normal text-gray-600 block mt-1">
                  Search results {filters.location ? `for ${filters.location}` : ''}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <Input
                    id="location"
                    placeholder="Enter city or area"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={handleNearMe}
                    disabled={isGettingLocation}
                  >
                    <Navigation className="w-4 h-4" />
                  </Button>
                </div>
                {isGettingLocation && (
                  <p className="text-xs text-blue-600">Getting your location...</p>
                )}
                {userLocation && userLocation !== 'Unknown' && (
                  <p className="text-xs text-green-600">📍 {userLocation}</p>
                )}
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
                    <SelectItem value="0-3000">Under ₹3,000</SelectItem>
                    <SelectItem value="3000-5000">₹3,000 - ₹5,000</SelectItem>
                    <SelectItem value="5000-8000">₹5,000 - ₹8,000</SelectItem>
                    <SelectItem value="8000-12000">₹8,000 - ₹12,000</SelectItem>
                    <SelectItem value="12000-18000">₹12,000 - ₹18,000</SelectItem>
                    <SelectItem value="18000-25000">₹18,000 - ₹25,000</SelectItem>
                    <SelectItem value="25000-35000">₹25,000 - ₹35,000</SelectItem>
                    <SelectItem value="35000-50000">₹35,000 - ₹50,000</SelectItem>
                    <SelectItem value="50000+">₹50,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleNearMe} variant="outline" className="w-full mr-2" disabled={isGettingLocation}>
                  <MapPin className="w-4 h-4 mr-2" />
                  Near Me
                </Button>
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
          title={hasSearched ? 'Search Results' : 'All Available Properties'}
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
