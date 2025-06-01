
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Wifi, Car, Home, Star, Heart } from 'lucide-react';
import AuthModal from '@/components/AuthModal';

const FindRoom = () => {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    type: 'login' | 'signup';
  }>({
    isOpen: false,
    type: 'login'
  });

  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    maxRent: '',
    amenities: [] as string[]
  });

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, type });
  };

  const closeAuthModal = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  // Mock property data
  const properties = [
    {
      id: 1,
      title: '2BHK Furnished Apartment',
      location: 'Koramangala, Bangalore',
      rent: 25000,
      deposit: 50000,
      type: 'full_flat_2bhk',
      rating: 4.5,
      reviews: 12,
      amenities: ['Wifi', 'Parking', 'AC'],
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Single Room Near IT Park',
      location: 'Electronic City, Bangalore',
      rent: 12000,
      deposit: 24000,
      type: 'single_room',
      rating: 4.2,
      reviews: 8,
      amenities: ['Wifi', 'Food'],
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'PG for Working Professionals',
      location: 'Whitefield, Bangalore',
      rent: 8000,
      deposit: 16000,
      type: 'pg_hostel_room',
      rating: 4.0,
      reviews: 15,
      amenities: ['Wifi', 'Food', 'Laundry'],
      image: '/placeholder.svg'
    }
  ];

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
                <Label htmlFor="maxRent">Max Rent (₹)</Label>
                <Input
                  id="maxRent"
                  type="number"
                  placeholder="Enter max rent"
                  value={filters.maxRent}
                  onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button className="w-full">Search Properties</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">₹{property.rent.toLocaleString()}</span>
                      <span className="text-gray-600 text-sm">/month</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm ml-1">{property.rating} ({property.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full">View Details</Button>
                    <div className="text-xs text-gray-500 text-center">
                      Security Deposit: ₹{property.deposit.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
