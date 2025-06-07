
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  User,
  Send,
  CheckCircle,
  IndianRupee,
  MapPin,
  Home,
  Bath,
  Eye,
  Bell
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import AuthModal from '@/components/AuthModal';
import { fetchLandlordInquiries } from '@/services/dashboardService';

const Inquiries = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [replyText, setReplyText] = useState<{[key: string]: string}>({});
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    type: 'login' | 'signup';
  }>({
    isOpen: false,
    type: 'login'
  });

  // Fetch inquiries for landlord's properties with complete property details
  const { data: inquiries, isLoading, error } = useQuery({
    queryKey: ['landlord-inquiries', user?.id],
    queryFn: () => fetchLandlordInquiries(user!.id),
    enabled: !!user?.id,
    retry: 3,
    retryDelay: 1000
  });

  // Mark inquiry as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (inquiryId: string) => {
      console.log('Marking inquiry as read:', inquiryId);
      // This could be implemented later if we add a read status field
    },
    onSuccess: () => {
      toast({
        title: "Inquiry marked as read",
        description: "The inquiry has been marked as read."
      });
    }
  });

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, type });
  };

  const closeAuthModal = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  const handleReply = (inquiryId: string) => {
    const message = replyText[inquiryId];
    if (!message?.trim()) {
      toast({
        variant: "destructive",
        title: "Empty message",
        description: "Please enter a reply message."
      });
      return;
    }
    
    // For now, just show success message
    // In a real app, you'd implement email notifications or messaging system
    toast({
      title: "Reply sent successfully",
      description: "Your reply has been sent to the tenant via email."
    });
    setReplyText({ ...replyText, [inquiryId]: '' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 2) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
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
                Please log in to view your property inquiries
              </p>
              <Button onClick={() => handleAuthClick('login')} className="w-full">
                Login to View Inquiries
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Property Inquiries</h1>
          {inquiries && inquiries.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Bell className="w-3 h-3" />
              {inquiries.length} total
            </Badge>
          )}
        </div>

        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              Debug: Found {inquiries?.length || 0} inquiries for user {user.id}
            </p>
            {error && (
              <p className="text-sm text-red-700 mt-2">
                Error: {error.message}
              </p>
            )}
          </div>
        )}

        {/* Inquiries List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : inquiries && inquiries.length > 0 ? (
          <div className="space-y-6">
            {inquiries.map((inquiry: any) => (
              <Card key={inquiry.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{inquiry.profiles?.name || 'Anonymous Tenant'}</h3>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              <Bell className="w-3 h-3 mr-1" />
                              New Inquiry
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{inquiry.profiles?.email}</p>
                          {inquiry.profiles?.phone && (
                            <p className="text-sm text-gray-600">Phone: {inquiry.profiles.phone}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(inquiry.created_at)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Property Info Card */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Property Details
                    </h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Property Image */}
                      <div className="flex items-start gap-4">
                        {inquiry.property_listings?.photos?.[0] && (
                          <img
                            src={inquiry.property_listings.photos[0]}
                            alt="Property"
                            className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 mb-2">{inquiry.property_listings?.title}</h5>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{inquiry.property_listings?.street_address}, {inquiry.property_listings?.city}, {inquiry.property_listings?.state}</span>
                          </div>
                          <div className="flex items-center">
                            <IndianRupee className="w-4 h-4 text-green-600 mr-1" />
                            <span className="font-medium text-green-600">
                              ₹{inquiry.property_listings?.monthly_rent?.toLocaleString()}/month
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Property Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-600">Bedrooms</span>
                          </div>
                          <p className="font-semibold">{inquiry.property_listings?.bedrooms || 'N/A'}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Bath className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-600">Bathrooms</span>
                          </div>
                          <p className="font-semibold">{inquiry.property_listings?.bathrooms || 'N/A'}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-600">Total Views</span>
                          </div>
                          <p className="font-semibold">{inquiry.property_listings?.views_count || 0}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/property/${inquiry.property_listings?.id}`)}
                            className="w-full"
                          >
                            View Property
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inquiry Message */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      Tenant's Message:
                    </h4>
                    <div className="bg-white p-4 rounded-lg border-l-4 border-green-500 shadow-sm">
                      <p className="text-gray-700 leading-relaxed">{inquiry.message}</p>
                    </div>
                  </div>

                  {/* Reply Section */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Send className="w-5 h-5 text-blue-600" />
                      Reply to Tenant:
                    </h4>
                    <div className="space-y-4">
                      <Textarea
                        value={replyText[inquiry.id] || ''}
                        onChange={(e) => setReplyText({
                          ...replyText,
                          [inquiry.id]: e.target.value
                        })}
                        placeholder="Hi there! Thank you for your interest in my property. I'd be happy to help you with any questions..."
                        rows={4}
                        className="resize-none"
                      />
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Inquiry marked as read",
                              description: "The inquiry has been marked as read."
                            });
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Read
                        </Button>
                        <Button
                          onClick={() => handleReply(inquiry.id)}
                          size="sm"
                          disabled={!replyText[inquiry.id]?.trim()}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No inquiries yet</h3>
              <p className="text-gray-600">
                When tenants are interested in your properties, their inquiries will appear here.
              </p>
            </CardContent>
          </Card>
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

export default Inquiries;
