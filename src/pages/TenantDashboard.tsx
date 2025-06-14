
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Search, 
  Heart, 
  Eye,
  Clock,
  MapPin,
  IndianRupee,
  Home,
  Bath,
  Reply,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthModal from '@/components/AuthModal';
import { fetchTenantDashboardStats, fetchTenantInquiries } from '@/services/dashboardService';

const TenantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    type: 'login' | 'signup';
  }>({
    isOpen: false,
    type: 'login'
  });

  // Fetch tenant dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['tenant-dashboard-stats', user?.id],
    queryFn: () => fetchTenantDashboardStats(user!.id),
    enabled: !!user?.id
  });

  // Fetch tenant inquiries
  const { data: inquiries, isLoading: inquiriesLoading } = useQuery({
    queryKey: ['tenant-inquiries', user?.id],
    queryFn: () => fetchTenantInquiries(user!.id),
    enabled: !!user?.id
  });

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, type });
  };

  const closeAuthModal = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onAuthClick={handleAuthClick} />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-4 sm:p-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Access Required</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Please log in to access your tenant dashboard
              </p>
              <Button onClick={() => handleAuthClick('login')} className="w-full">
                Login to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
        <AuthModal
          isOpen={authModal.isOpen}
          onClose={closeAuthModal}
          initialType={authModal.type}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthClick={handleAuthClick} />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tenant Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">Welcome back! Track your property search and inquiries</p>
          </div>
          <Button onClick={() => navigate('/find-room')} className="w-fit">
            <Search className="w-4 h-4 mr-2" />
            Find Properties
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Inquiries</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {statsLoading ? '...' : stats?.totalInquiries || 0}
                  </p>
                </div>
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Recent Inquiries</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {statsLoading ? '...' : stats?.recentInquiries || 0}
                  </p>
                </div>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Responded</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {statsLoading ? '...' : stats?.respondedInquiries || 0}
                  </p>
                </div>
                <Reply className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Viewed</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {statsLoading ? '...' : stats?.viewedProperties || 0}
                  </p>
                </div>
                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Inquiries */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Your Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {inquiriesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : inquiries && inquiries.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {inquiries.map((inquiry: any) => (
                  <div key={inquiry.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Property Image */}
                      {inquiry.property_listings?.photos?.[0] && (
                        <img
                          src={inquiry.property_listings.photos[0]}
                          alt="Property"
                          className="w-full lg:w-24 h-48 lg:h-24 rounded-lg object-cover"
                        />
                      )}
                      
                      {/* Property Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                              {inquiry.property_listings?.title}
                            </h3>
                            <div className="flex items-start text-xs sm:text-sm text-gray-600 mb-1">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 mt-0.5 flex-shrink-0" />
                              <span className="break-words">
                                {inquiry.property_listings?.city}, {inquiry.property_listings?.state}
                              </span>
                            </div>
                            <div className="flex items-center mb-2">
                              <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mr-1" />
                              <span className="font-medium text-green-600 text-sm sm:text-base">
                                ₹{inquiry.property_listings?.monthly_rent?.toLocaleString()}/month
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs w-fit">
                              Sent {formatDate(inquiry.created_at)}
                            </Badge>
                            {inquiry.replies && inquiry.replies.length > 0 && (
                              <Badge className="text-xs bg-green-100 text-green-800 border-green-200 w-fit">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Replied
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Property Stats */}
                        <div className="flex items-center gap-4 sm:gap-6 mb-3 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{inquiry.property_listings?.bedrooms || 'N/A'} bed</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{inquiry.property_listings?.bathrooms || 'N/A'} bath</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{inquiry.property_listings?.views_count || 0} views</span>
                          </div>
                        </div>

                        {/* Inquiry Message */}
                        <div className="bg-gray-50 p-2 sm:p-3 rounded-lg mb-3">
                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                            <strong>Your message:</strong> {inquiry.message}
                          </p>
                        </div>

                        {/* Replies */}
                        {inquiry.replies && inquiry.replies.length > 0 && (
                          <div className="mb-3">
                            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                              <Reply className="w-4 h-4 text-purple-600" />
                              Landlord Replies:
                            </h4>
                            <div className="space-y-2">
                              {inquiry.replies.map((reply: any) => (
                                <div key={reply.id} className="bg-blue-50 p-2 sm:p-3 rounded-lg border-l-4 border-blue-500">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-xs">
                                      Landlord Reply
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(reply.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                    {reply.message}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/property/${inquiry.property_listings?.id}`)}
                            className="text-xs sm:text-sm h-8 sm:h-9"
                          >
                            View Property
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Navigate to property contact page or open inquiry form
                              navigate(`/property/${inquiry.property_listings?.id}`);
                            }}
                            className="text-xs sm:text-sm h-8 sm:h-9"
                          >
                            Follow Up
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No inquiries yet</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  Start exploring properties and send inquiries to landlords.
                </p>
                <Button onClick={() => navigate('/find-room')}>
                  <Search className="w-4 h-4 mr-2" />
                  Browse Properties
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialType={authModal.type}
      />
    </div>
  );
};

export default TenantDashboard;
