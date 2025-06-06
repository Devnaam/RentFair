
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { 
  fetchDashboardStats, 
  fetchLandlordProperties, 
  deleteProperty,
  updatePropertyStatus 
} from '@/services/dashboardService';
import { supabase } from '@/integrations/supabase/client';

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
        <DashboardHeader 
          userName={userProfile?.name} 
          userEmail={user.email} 
        />

        <DashboardStats 
          stats={stats} 
          isLoading={statsLoading} 
        />

        <DashboardContent
          properties={properties}
          stats={stats}
          isLoadingProperties={propertiesLoading}
          onEditProperty={handleEditProperty}
          onViewProperty={handleViewProperty}
          onPublishProperty={handlePublishProperty}
          onDeleteProperty={handleDeleteProperty}
          isPublishing={publishPropertyMutation.isPending}
          isDeleting={deletePropertyMutation.isPending}
        />
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
