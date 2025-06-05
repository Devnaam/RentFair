
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Access Required</h2>
              <p className="text-gray-600 mb-6">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <UserCheck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Tenant Account</h2>
              <p className="text-gray-600 mb-6">
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Landlord Dashboard</h1>
              <Badge variant="default" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <Crown className="w-4 h-4 mr-1" />
                Landlord Account
              </Badge>
            </div>
            <p className="text-gray-600">Welcome back, {userProfile?.name || user.email}! Manage your properties and connect with tenants</p>
          </div>
          <Button onClick={() => navigate('/list-property')}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Property
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? '...' : `₹${stats?.monthlyRevenue?.toLocaleString() || 0}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? '...' : stats?.totalViews || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New Inquiries</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? '...' : stats?.newInquiries || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Properties</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? '...' : stats?.activeProperties || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList>
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="inquiries" onClick={() => navigate('/inquiries')}>Inquiries</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            {propertiesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
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
              <div className="grid gap-6">
                {properties.map((property) => (
                  <Card key={property.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-4 flex-1">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{property.title}</h3>
                              <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                                {property.status === 'active' ? 'Active' : property.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600">{property.location}</p>
                            <p className="text-2xl font-bold text-primary">₹{property.rent.toLocaleString()}/month</p>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-6">
                            <div className="flex items-center">
                              <Eye className="w-5 h-5 text-blue-600 mr-2" />
                              <div>
                                <p className="font-semibold">{property.views}</p>
                                <p className="text-sm text-gray-600">Views this week</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="w-5 h-5 text-green-600 mr-2" />
                              <div>
                                <p className="font-semibold">{property.inquiries}</p>
                                <p className="text-sm text-gray-600">New inquiries</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-5 h-5 text-yellow-500 mr-2" />
                              <div>
                                <p className="font-semibold">{property.rating}</p>
                                <p className="text-sm text-gray-600">({property.reviews} reviews)</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProperty(property.id)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewProperty(property.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          {property.status === 'draft' && (
                            <Button 
                              size="sm"
                              onClick={() => handlePublishProperty(property.id)}
                              disabled={publishPropertyMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Publish
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProperty(property.id)}
                            disabled={deletePropertyMutation.isPending}
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
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
                  <p className="text-gray-600 mb-4">
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

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Analytics charts and performance metrics will be displayed here.</p>
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
