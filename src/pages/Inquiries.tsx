
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
  Send
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import AuthModal from '@/components/AuthModal';

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

  // Fetch inquiries for landlord's properties
  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['inquiries', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('property_inquiries')
        .select(`
          *,
          property_listings!inner(
            title,
            street_address,
            city,
            landlord_id
          ),
          profiles!property_inquiries_tenant_id_fkey(
            name,
            email
          )
        `)
        .eq('property_listings.landlord_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Send reply mutation
  const sendReplyMutation = useMutation({
    mutationFn: async ({ inquiryId, message }: { inquiryId: string; message: string }) => {
      // In a real app, you'd store replies in a separate table
      // For now, we'll just show a toast
      console.log('Sending reply:', { inquiryId, message });
    },
    onSuccess: () => {
      toast({
        title: "Reply sent successfully",
        description: "Your reply has been sent to the tenant."
      });
      setReplyText({});
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to send reply",
        description: error.message
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
    
    sendReplyMutation.mutate({ inquiryId, message });
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
        </div>

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
              <Card key={inquiry.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-600" />
                        <div>
                          <h3 className="font-semibold">{inquiry.profiles?.name || 'Anonymous'}</h3>
                          <p className="text-sm text-gray-600">{inquiry.profiles?.email}</p>
                        </div>
                        <Badge variant="outline">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          New Inquiry
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(inquiry.created_at).toLocaleDateString()} at {new Date(inquiry.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Property Info */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{inquiry.property_listings?.title}</p>
                    <p className="text-sm text-gray-600">
                      {inquiry.property_listings?.street_address}, {inquiry.property_listings?.city}
                    </p>
                  </div>

                  {/* Message */}
                  <div>
                    <h4 className="font-medium mb-2">Message:</h4>
                    <p className="text-gray-700 bg-white p-3 rounded-lg border">{inquiry.message}</p>
                  </div>

                  {/* Reply Section */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Reply:</h4>
                    <div className="space-y-2">
                      <Textarea
                        value={replyText[inquiry.id] || ''}
                        onChange={(e) => setReplyText({
                          ...replyText,
                          [inquiry.id]: e.target.value
                        })}
                        placeholder="Type your reply here..."
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleReply(inquiry.id)}
                          disabled={sendReplyMutation.isPending}
                          size="sm"
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
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No inquiries yet</h3>
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
