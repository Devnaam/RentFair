
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  MessageSquare, 
  Star, 
  Plus, 
  Edit, 
  Trash2,
  TrendingUp,
  Users,
  IndianRupee,
  Send,
  Crown,
  UserCheck
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchDashboardStats, 
  fetchLandlordProperties, 
  deleteProperty,
  updatePropertyStatus 
} from '@/services/dashboardService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    type: 'login' | 'signup';
  }>({
    isOpen: false,
    type: 'login'
  });

  // Fetch user profile to get role
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role, name')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, type });
  };

  const closeAuthModal = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  // Check if user is landlord
  const isLandlord = userProfile?.role === 'landlord';

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: () => fetchDashboardStats(user!.id),
    enabled: !!user?.id && isLandlord
  });

  // Fetch landlord properties
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['landlord-properties', user?.id],
    queryFn: () => fetchLandlordProperties(user!.id),
    enabled: !!user?.id && isLandlord
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      toast({
        title: "Property deleted successfully",
        description: "The property has been removed from your listings."
      });
      queryClient.invalidateQueries({ queryKey: ['landlord-properties'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to delete property",
        description: error.message
      });
    }
  });

  // Publish property mutation
  const publishPropertyMutation = useMutation({
    mutationFn: (propertyId: string) => updatePropertyStatus(propertyId, 'active'),
    onSuccess: () => {
      toast({
        title: "Property published successfully",
        description: "Your property is now live and visible to tenants."
      });
      queryClient.invalidateQueries({ queryKey: ['landlord-properties'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to publish property",
        description: error.message
      });
    }
  });

  const handleDeleteProperty = (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      deletePropertyMutation.mutate(propertyId);
    }
  };

  const handlePublishProperty = (propertyId: string) => {
    publishPropertyMutation.mutate(propertyId);
  };

  const handleViewProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  const handleEditProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
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
                Please log in to access your dashboard
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

  // If user is not a landlord, show tenant message
  if (userProfile && !isLandlord) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onAuthClick={handleAuthClick} />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-4 sm:p-8 text-center">
              <UserCheck className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Tenant Account</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                You're logged in as a tenant. This dashboard is only available for landlords who want to list their properties.
              </p>
              <div className="space-y-3">
                <Button onClick={() => navigate('/find-room')} className="w-full">
                  Find Properties
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthClick={handleAuthClick} />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Landlord Dashboard</h1>
              <Badge variant="default" className="bg-yellow-100 text-yellow-800 border-yellow-200 w-fit">
                <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Landlord Account
              </Badge>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">Welcome back, {userProfile?.name || user.email}! Manage your properties and connect with tenants</p>
          </div>
          <Button onClick={() => navigate('/list-property')} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Add New Property</span>
            <span className="sm:hidden">Add Property</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <IndianRupee className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Monthly Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold truncate">
                    {statsLoading ? '...' : `₹${stats?.monthlyRevenue?.toLocaleString() || 0}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Views</p>
                  <p className="text-lg sm:text-2xl font-bold">
                    {statsLoading ? '...' : stats?.totalViews || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">New Inquiries</p>
                  <p className="text-lg sm:text-2xl font-bold">
                    {statsLoading ? '...' : stats?.newInquiries || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Active Properties</p>
                  <p className="text-lg sm:text-2xl font-bold">
                    {statsLoading ? '...' : stats?.activeProperties || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties" className="text-xs sm:text-sm">My Properties</TabsTrigger>
            <TabsTrigger value="inquiries" onClick={() => navigate('/inquiries')} className="text-xs sm:text-sm">Inquiries</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-4 sm:space-y-6">
            {propertiesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : properties && properties.length > 0 ? (
              <div className="grid gap-4 sm:gap-6">
                {properties.map((property) => (
                  <Card key={property.id}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
                        <div className="space-y-3 sm:space-y-4 flex-1">
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                              <h3 className="text-lg sm:text-xl font-semibold">{property.title}</h3>
                              <Badge variant={property.status === 'active' ? 'default' : 'secondary'} className="w-fit">
                                {property.status === 'active' ? 'Active' : property.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base">{property.location}</p>
                            <p className="text-xl sm:text-2xl font-bold text-primary">₹{property.rent.toLocaleString()}/month</p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
                              <div>
                                <p className="font-semibold text-sm sm:text-base">{property.views}</p>
                                <p className="text-xs sm:text-sm text-gray-600">Views this week</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" />
                              <div>
                                <p className="font-semibold text-sm sm:text-base">{property.inquiries}</p>
                                <p className="text-xs sm:text-sm text-gray-600">New inquiries</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-2" />
                              <div>
                                <p className="font-semibold text-sm sm:text-base">{property.rating}</p>
                                <p className="text-xs sm:text-sm text-gray-600">({property.reviews} reviews)</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 lg:flex-col lg:min-w-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProperty(property.id)}
                            className="flex-1 sm:flex-none"
                          >
                            <Edit className="w-4 h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewProperty(property.id)}
                            className="flex-1 sm:flex-none"
                          >
                            <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          {property.status === 'draft' && (
                            <Button 
                              size="sm"
                              onClick={() => handlePublishProperty(property.id)}
                              disabled={publishPropertyMutation.isPending}
                              className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                            >
                              <Send className="w-4 h-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">Publish</span>
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProperty(property.id)}
                            disabled={deletePropertyMutation.isPending}
                            className="flex-1 sm:flex-none"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 sm:p-8 text-center">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No properties yet</h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Start by adding your first property to the platform.
                  </p>
                  <Button onClick={() => navigate('/list-property')}>
                    <Plus className="w-4 h-4 mr-2" />
                    List Your First Property
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Property Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">Analytics charts and performance metrics will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialType={authModal.type}
      />
    </div>
  );
};

export default Dashboard;
