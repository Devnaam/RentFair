
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Shield, Star, TrendingUp } from 'lucide-react';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = () => {
    console.log('Search initiated:', { searchLocation, propertyType, budget });
    
    // Navigate to FindRoom page with search parameters
    const searchParams = new URLSearchParams();
    if (searchLocation) searchParams.set('location', searchLocation);
    if (propertyType) searchParams.set('propertyType', propertyType);
    if (budget) searchParams.set('budget', budget);
    
    navigate(`/find-room?${searchParams.toString()}`);
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Find Your Perfect Room
            <span className="block text-primary">Scam-Free & Transparent</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students and job seekers who found their ideal homes through RentFair. 
            No hidden fees, no broker exploitation, just honest rentals with AI-powered fair pricing.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Enter location, landmark, or college name"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10 h-12 text-base border-gray-200 focus:border-primary"
                  />
                </div>
              </div>
              
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-12 border-gray-200 focus:border-primary">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single_room">Single Room</SelectItem>
                  <SelectItem value="shared_room">Shared Room</SelectItem>
                  <SelectItem value="full_flat_1bhk">1 BHK</SelectItem>
                  <SelectItem value="full_flat_2bhk">2 BHK</SelectItem>
                  <SelectItem value="pg_hostel_room">PG/Hostel</SelectItem>
                </SelectContent>
              </Select>

              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger className="h-12 border-gray-200 focus:border-primary">
                  <SelectValue placeholder="Budget" />
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
            
            <Button
              onClick={handleSearch}
              className="w-full md:w-auto mt-4 bg-primary hover:bg-primary-dark text-white px-8 py-3 h-12 text-base font-medium"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Properties
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Listings</h3>
              <p className="text-gray-600 text-sm">All properties verified for authenticity and accuracy</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Fair Pricing</h3>
              <p className="text-gray-600 text-sm">Smart price analysis to ensure you pay fair rates</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real Reviews</h3>
              <p className="text-gray-600 text-sm">Honest reviews from verified tenants and landlords</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
