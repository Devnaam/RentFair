
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Shield, MessageSquare, Star, Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSampleProperty } from '@/hooks/useSampleProperty';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { trackDashboardClick, trackPropertyRotation } from '@/services/analyticsService';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton';
import PropertyImageDisplay from '@/components/PropertyImageDisplay';
import { toast } from '@/hooks/use-toast';

const LandlordSection: React.FC = () => {
  const navigate = useNavigate();
  const { property, loading, error, rotateProperty } = useSampleProperty();
  const { user, isAuthenticated } = useAuthStatus();

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Higher Occupancy Rates',
      description: 'Reach verified tenants actively looking for quality accommodations'
    },
    {
      icon: Shield,
      title: 'Verified Tenants',
      description: 'Connect with background-checked, reliable tenants through our screening process'
    },
    {
      icon: Star,
      title: 'Build Your Reputation',
      description: 'Collect authentic reviews and build trust with potential tenants'
    },
    {
      icon: MessageSquare,
      title: 'Direct Communication',
      description: 'Engage directly with interested tenants through secure messaging'
    },
    {
      icon: Eye,
      title: 'Complete Transparency',
      description: 'Showcase your property honestly and attract the right tenants'
    },
    {
      icon: Plus,
      title: 'Easy Listing Management',
      description: 'Simple tools to create, edit, and manage your property listings'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'rented':
        return 'Rented';
      case 'pending_review':
        return 'Pending Review';
      case 'inactive':
        return 'Inactive';
      case 'draft':
        return 'Draft';
      default:
        return 'Draft';
    }
  };

  const handleDashboardClick = () => {
    trackDashboardClick(property?.id);
    navigate('/dashboard');
  };

  const handleRotateProperty = () => {
    trackPropertyRotation(property?.id);
    rotateProperty();
    toast({
      title: "Property rotated",
      description: "Showing a different property example"
    });
  };

  const handleListPropertyClick = () => {
    if (isAuthenticated) {
      navigate('/list-property');
    } else {
      toast({
        title: "Authentication required",
        description: "Please sign in to list your property"
      });
      // You could also trigger an auth modal here
    }
  };

  return (
    <section id="for-landlords" className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              List Your Property on RentFair
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
              Join our community of trusted landlords and connect with quality tenants. 
              Our platform helps you rent faster while maintaining transparency and trust.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <benefit.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-primary hover:bg-primary-dark text-white px-6 md:px-8 py-2 md:py-3"
                onClick={handleListPropertyClick}
              >
                <Plus className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                List Your Property
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                Learn More
              </Button>
            </div>

            {isAuthenticated && (
              <p className="text-sm text-green-600 mt-2">
                ✓ You're signed in and ready to list properties!
              </p>
            )}
          </div>

          {/* Visual - Property Card */}
          <div className="relative order-1 lg:order-2">
            {loading ? (
              <PropertyCardSkeleton />
            ) : error ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <p className="text-lg font-semibold mb-2">No Properties Available</p>
                  <p className="text-sm">{error}</p>
                </div>
                <Button variant="outline" onClick={rotateProperty}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate pr-2">
                      {property?.title || 'Property Listing'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                        property ? getStatusColor(property.status) : 'bg-green-100 text-green-800'
                      }`}>
                        {property ? getStatusText(property.status) : 'Active'}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRotateProperty}
                        title="Show different property"
                        className="p-1 h-auto"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <PropertyImageDisplay 
                    photos={property?.photos || []} 
                    title={property?.title || 'Property'} 
                  />
                  
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm md:text-base">Location</span>
                      <span className="font-semibold text-gray-900 text-xs md:text-sm text-right max-w-36 md:max-w-48 truncate">
                        {property?.location || 'Sample Location'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm md:text-base">Monthly Rent</span>
                      <span className="font-semibold text-gray-900 text-sm md:text-base">
                        ₹{property?.rent?.toLocaleString() || '12,000'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm md:text-base">Views This Week</span>
                      <span className="font-semibold text-primary text-sm md:text-base">
                        {property?.views || '147'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm md:text-base">Inquiries</span>
                      <span className="font-semibold text-green-600 text-sm md:text-base">
                        {property?.inquiries || '8'} New
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm md:text-base">Rating</span>
                      <div className="flex items-center">
                        <Star className="w-3 md:w-4 h-3 md:h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900 ml-1 text-sm md:text-base">
                          {property?.rating || '4.8'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary-dark text-white text-sm md:text-base"
                    onClick={handleDashboardClick}
                  >
                    View Full Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandlordSection;
