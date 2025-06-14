
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthModal from '@/components/AuthModal';
import { fetchTenantDashboardStats, fetchTenantInquiries, saveInquiryReply } from '@/services/dashboardService';
import { useToast } from '@/hooks/use-toast';
import TenantDashboardHeader from '@/components/tenant/TenantDashboardHeader';
import TenantDashboardStats from '@/components/tenant/TenantDashboardStats';
import InquiriesList from '@/components/tenant/InquiriesList';

const TenantDashboard = () => {
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

  const [replyMessages, setReplyMessages] = useState<{ [key: string]: string }>({});
  const [sendingReply, setSendingReply] = useState<{ [key: string]: boolean }>({});

  // Fetch tenant dashboard statistics
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['tenant-dashboard-stats', user?.id],
    queryFn: () => fetchTenantDashboardStats(user!.id),
    enabled: !!user?.id
  });

  // Fetch tenant inquiries
  const { data: inquiries, isLoading: inquiriesLoading, refetch: refetchInquiries } = useQuery({
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

  const handleRefreshData = async () => {
    try {
      await Promise.all([refetchStats(), refetchInquiries()]);
      toast({
        title: "Data refreshed",
        description: "Your dashboard has been updated with the latest information.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendReply = async (inquiryId: string) => {
    const message = replyMessages[inquiryId]?.trim();
    if (!message) {
      toast({
        title: "Message required",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }

    setSendingReply(prev => ({ ...prev, [inquiryId]: true }));

    try {
      await saveInquiryReply(inquiryId, message, 'tenant');
      
      // Clear the message
      setReplyMessages(prev => ({ ...prev, [inquiryId]: '' }));
      
      // Refresh inquiries
      await refetchInquiries();
      
      toast({
        title: "Reply sent",
        description: "Your reply has been sent to the landlord.",
      });
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Failed to send",
        description: "Failed to send your reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingReply(prev => ({ ...prev, [inquiryId]: false }));
    }
  };

  const handleViewProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  const handleBrowseProperties = () => {
    navigate('/find-room');
  };

  const handleReplyChange = (inquiryId: string, message: string) => {
    setReplyMessages(prev => ({ ...prev, [inquiryId]: message }));
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
        <TenantDashboardHeader 
          onRefreshData={handleRefreshData}
          onBrowseProperties={handleBrowseProperties}
        />

        {/* Stats Cards */}
        <TenantDashboardStats 
          stats={stats}
          isLoading={statsLoading}
        />

        {/* Recent Inquiries */}
        <InquiriesList
          inquiries={inquiries}
          isLoading={inquiriesLoading}
          replyMessages={replyMessages}
          sendingReply={sendingReply}
          formatDate={formatDate}
          onReplyChange={handleReplyChange}
          onSendReply={handleSendReply}
          onViewProperty={handleViewProperty}
          onBrowseProperties={handleBrowseProperties}
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

export default TenantDashboard;
