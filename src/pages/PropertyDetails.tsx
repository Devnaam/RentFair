
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import AuthModal from '@/components/AuthModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Home,
  Bath,
  Maximize,
  Calendar,
  Shield,
  Send,
  ChevronLeft,
  ChevronRight,
  Play,
  User,
  MessageSquare
} from 'lucide-react';
import { incrementPropertyViews } from '@/services/dashboardService';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    type: 'login' | 'signup';
  }>({
    isOpen: false,
    type: 'login'
  });

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, type });
  };

  const closeAuthModal = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  // Fetch property details
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) throw new Error('Property ID is required');
      
      const { data, error } = await supabase
        .from('property_listings')
        .select(`
          *,
          profiles!property_listings_landlord_id_fkey(
            name,
            email,
            phone
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Track property view when page loads
  useEffect(() => {
    if (id && user && property?.landlord_id !== user.id) {
      // Only track views if user is not the landlord
      incrementPropertyViews(id);
    }
  }, [id, user, property?.landlord_id]);

  // Send inquiry mutation
  const sendInquiryMutation = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      if (!user || !id) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('property_inquiries')
        .insert({
          listing_id: id,
          tenant_id: user.id,
          message: message.trim()
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Inquiry sent successfully",
        description: "Your inquiry has been sent to the landlord. They will get back to you soon!"
      });
      setInquiryMessage('');
      setShowInquiryForm(false);
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to send inquiry",
        description: error.message || "Please try again"
      });
    }
  });

  const handleSendInquiry = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to send an inquiry"
      });
      handleAuthClick('login');
      return;
    }

    if (!inquiryMessage.trim()) {
      toast({
        variant: "destructive",
        title: "Message required",
        description: "Please enter your inquiry message"
      });
      return;
    }

    sendInquiryMutation.mutate({ message: inquiryMessage });
  };

  const nextPhoto = () => {
    if (property?.photos && property.photos.length > 0) {
      setCurrentPhotoIndex((prev) => 
        prev === property.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (property?.photos && property.photos.length > 0) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? property.photos.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onAuthClick={handleAuthClick} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onAuthClick={handleAuthClick} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
              <p className="text-gray-600 mb-6">
                The property you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isOwner = user && user.id === property.landlord_id;
  const photos = property.photos || [];
  const hasMedia = photos.length > 0 || property.video_tour_url;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthClick={handleAuthClick} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photos and Video Section */}
            {hasMedia && (
              <Card>
                <CardContent className="p-0">
                  {photos.length > 0 && (
                    <div className="relative">
                      <img
                        src={photos[currentPhotoIndex]}
                        alt={`Property photo ${currentPhotoIndex + 1}`}
                        className="w-full h-96 object-cover rounded-t-lg"
                      />
                      {photos.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={prevPhoto}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={nextPhoto}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentPhotoIndex + 1} / {photos.length}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  
                  {property.video_tour_url && (
                    <div className="p-4 border-t">
                      <div className="flex items-center gap-2 mb-3">
                        <Play className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Video Tour</h3>
                      </div>
                      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <iframe
                          src={property.video_tour_url}
                          className="w-full h-full"
                          allowFullScreen
                          title="Property Video Tour"
                        />
                      </div>
                    </div>
                  )}
                  
                  {photos.length > 1 && (
                    <div className="p-4 border-t">
                      <div className="flex gap-2 overflow-x-auto">
                        {photos.map((photo, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPhotoIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                              index === currentPhotoIndex ? 'border-primary' : 'border-gray-200'
                            }`}
                          >
                            <img
                              src={photo}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{property.street_address}, {property.city}, {property.state} - {property.pincode}</span>
                    </div>
                    <div className="flex items-center">
                      <IndianRupee className="w-5 h-5 text-green-600 mr-1" />
                      <span className="text-2xl font-bold text-green-600">
                        ₹{property.monthly_rent?.toLocaleString()}/month
                      </span>
                    </div>
                  </div>
                  <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                    {property.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-primary" />
                      <span>{property.bedrooms} Bedrooms</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-primary" />
                      <span>{property.bathrooms} Bathrooms</span>
                    </div>
                  )}
                  {property.size_sqft && (
                    <div className="flex items-center gap-2">
                      <Maximize className="w-5 h-5 text-primary" />
                      <span>{property.size_sqft} sq ft</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>Available {new Date(property.availability_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <Separator />

                {/* Rent Details */}
                <div>
                  <h3 className="font-semibold mb-3">Rent & Fees</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span>Monthly Rent:</span>
                      <span className="font-semibold">₹{property.monthly_rent?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Deposit:</span>
                      <span className="font-semibold">₹{property.security_deposit?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Broker Fee:</span>
                      <span className="font-semibold">{property.broker_free ? 'No' : 'Yes'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Minimum Stay:</span>
                      <span className="font-semibold">{property.minimum_stay_months} months</span>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {property.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-sm">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Utilities */}
                {property.utilities_included && property.utilities_included.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Utilities Included</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {property.utilities_included.map((utility, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm">{utility}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* House Rules */}
                {property.house_rules && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">House Rules</h3>
                      <p className="text-gray-700">{property.house_rules}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Landlord Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Landlord Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold">Name:</span>
                    <p>{property.profiles?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span>
                    <p>{property.profiles?.email || 'Not provided'}</p>
                  </div>
                  {property.profiles?.phone && (
                    <div>
                      <span className="font-semibold">Phone:</span>
                      <p>{property.profiles.phone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact/Inquiry Section */}
            {!isOwner && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Interested in this property?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!showInquiryForm ? (
                    <Button 
                      className="w-full" 
                      onClick={() => setShowInquiryForm(true)}
                    >
                      Send Inquiry
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <Textarea
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder="Hi, I'm interested in this property. Could you provide more details about..."
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSendInquiry}
                          disabled={sendInquiryMutation.isPending || !inquiryMessage.trim()}
                          className="flex-1"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {sendInquiryMutation.isPending ? 'Sending...' : 'Send'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowInquiryForm(false);
                            setInquiryMessage('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Your inquiry will be sent securely to the landlord</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {isOwner && (
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    This is your property listing
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/dashboard')}
                    className="w-full"
                  >
                    Go to Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
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

export default PropertyDetails;
