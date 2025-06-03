
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  MapPin, 
  IndianRupee,
  BedDouble,
  Bath,
  Home,
  Calendar,
  Send
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AuthModal from '@/components/AuthModal';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    type: 'login' | 'signup';
  }>({
    isOpen: false,
    type: 'login'
  });

  // Fetch property details
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_listings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Update property mutation (exclude title from updates)
  const updatePropertyMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      // Remove title from the update data since it's auto-generated
      const { title, ...dataToUpdate } = updatedData;
      
      const { error } = await supabase
        .from('property_listings')
        .update(dataToUpdate)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Property updated successfully",
        description: "Your property details have been saved."
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      queryClient.invalidateQueries({ queryKey: ['landlord-properties'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to update property",
        description: error.message
      });
    }
  });

  // Publish property mutation
  const publishPropertyMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('property_listings')
        .update({ status: 'active' })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Property published successfully",
        description: "Your property is now live and visible to tenants."
      });
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      queryClient.invalidateQueries({ queryKey: ['landlord-properties'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to publish property",
        description: error.message
      });
    }
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('property_listings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Property deleted successfully",
        description: "Your property has been removed from the platform."
      });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to delete property",
        description: error.message
      });
    }
  });

  useEffect(() => {
    if (property) {
      setEditData(property);
    }
  }, [property]);

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, type });
  };

  const closeAuthModal = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  const handleSave = () => {
    updatePropertyMutation.mutate(editData);
  };

  const handlePublish = () => {
    publishPropertyMutation.mutate();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      deletePropertyMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onAuthClick={handleAuthClick} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
              <p className="text-gray-600 mb-6">
                The property you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Property Details</h1>
          </div>
          
          {user?.id === property.landlord_id && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={updatePropertyMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  {property.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={handlePublish}
                      disabled={publishPropertyMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Publish
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deletePropertyMutation.isPending}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Property Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{property.title}</CardTitle>
                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {isEditing ? (
                        <Input
                          value={`${editData.street_address}, ${editData.city}, ${editData.state} ${editData.pincode}`}
                          onChange={(e) => {
                            const parts = e.target.value.split(', ');
                            setEditData({
                              ...editData,
                              street_address: parts[0] || '',
                              city: parts[1] || '',
                              state: parts[2]?.split(' ')[0] || '',
                              pincode: parts[2]?.split(' ')[1] || ''
                            });
                          }}
                          placeholder="Street, City, State Pincode"
                        />
                      ) : (
                        <span>{property.street_address}, {property.city}, {property.state} {property.pincode}</span>
                      )}
                    </div>
                  </div>
                  <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                    {property.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Property Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <BedDouble className="w-5 h-5 text-gray-600 mr-2" />
                    <div>
                      <p className="font-semibold">{property.bedrooms || 'N/A'}</p>
                      <p className="text-sm text-gray-600">Bedrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-5 h-5 text-gray-600 mr-2" />
                    <div>
                      <p className="font-semibold">{property.bathrooms || 'N/A'}</p>
                      <p className="text-sm text-gray-600">Bathrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Home className="w-5 h-5 text-gray-600 mr-2" />
                    <div>
                      <p className="font-semibold">{property.size_sqft || 'N/A'}</p>
                      <p className="text-sm text-gray-600">Sq ft</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-600 mr-2" />
                    <div>
                      <p className="font-semibold">{new Date(property.availability_date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">Available</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-base font-semibold">Description</Label>
                  {isEditing ? (
                    <Textarea
                      value={editData.house_rules || ''}
                      onChange={(e) => setEditData({...editData, house_rules: e.target.value})}
                      placeholder="Property description and house rules"
                      className="mt-2"
                      rows={4}
                    />
                  ) : (
                    <p className="mt-2 text-gray-700">{property.house_rules || 'No description available'}</p>
                  )}
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <Label className="text-base font-semibold">Amenities</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {property.amenities.map((amenity: string, index: number) => (
                        <Badge key={index} variant="outline">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Utilities */}
                {property.utilities_included && property.utilities_included.length > 0 && (
                  <div>
                    <Label className="text-base font-semibold">Utilities Included</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {property.utilities_included.map((utility: string, index: number) => (
                        <Badge key={index} variant="secondary">{utility}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <IndianRupee className="w-5 h-5 text-primary mr-2" />
                  <div>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editData.monthly_rent || ''}
                        onChange={(e) => setEditData({...editData, monthly_rent: parseInt(e.target.value)})}
                        className="text-2xl font-bold"
                      />
                    ) : (
                      <p className="text-2xl font-bold">₹{property.monthly_rent?.toLocaleString()}</p>
                    )}
                    <p className="text-sm text-gray-600">per month</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span>Security Deposit:</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editData.security_deposit || ''}
                        onChange={(e) => setEditData({...editData, security_deposit: parseInt(e.target.value)})}
                        className="w-32"
                      />
                    ) : (
                      <span>₹{property.security_deposit?.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span>Broker Fee:</span>
                    <span>{property.broker_free ? 'No' : 'Yes'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Views:</span>
                    <span className="font-semibold">{property.views_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Property Type:</span>
                    <span className="font-semibold">{property.property_type?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Furnishing:</span>
                    <span className="font-semibold">{property.furnishing_status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Listed:</span>
                    <span className="font-semibold">{new Date(property.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
