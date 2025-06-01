
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

const FindRoom = () => {
  const [searchParams] = useSearchParams();
  const { properties, isLoading, error, executeSearch } = usePropertySearch();
  
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
    maxRent: undefined,
    amenities: []
  });

  const [hasSearched, setHasSearched] = useState(false);

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

  // Auto-search if URL parameters are present
  useEffect(() => {
    const hasUrlParams = searchParams.get('location') || searchParams.get('propertyType') || searchParams.get('budget');
    if (hasUrlParams && !hasSearched) {
      handleSearch();
    }
  }, [searchParams, hasSearched]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthClick={handleAuthClick} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Perfect Room</CardTitle>
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
                <Button onClick={handleSearch} className="w-full" disabled={isLoading}>
                  {isLoading ? 'Searching...' : 'Search Properties'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {(hasSearched || isLoading) && (
          <SearchResults 
            properties={properties} 
            isLoading={isLoading} 
            error={error} 
          />
        )}

        {/* Default message when no search has been performed */}
        {!hasSearched && !isLoading && (
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
