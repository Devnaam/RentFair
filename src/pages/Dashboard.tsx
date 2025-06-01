
import React, { useState } from 'react';
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
  IndianRupee
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    type: 'login' | 'signup';
  }>({
    isOpen: false,
    type: 'login'
  });

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, type });
  };

  const closeAuthModal = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  // Mock data for properties
  const properties = [
    {
      id: 1,
      title: '2BHK Furnished Apartment',
      location: 'Koramangala, Bangalore',
      rent: 25000,
      status: 'active',
      views: 147,
      inquiries: 8,
      rating: 4.8,
      reviews: 12
    },
    {
      id: 2,
      title: 'Single Room Near IT Park',
      location: 'Electronic City, Bangalore',
      rent: 12000,
      status: 'rented',
      views: 89,
      inquiries: 3,
      rating: 4.5,
      reviews: 7
    }
  ];

  // Mock data for inquiries
  const inquiries = [
    {
      id: 1,
      tenant: 'John Doe',
      property: '2BHK Furnished Apartment',
      message: 'Hi, I am interested in viewing this property...',
      date: '2 hours ago',
      status: 'new'
    },
    {
      id: 2,
      tenant: 'Jane Smith',
      property: 'Single Room Near IT Park',
      message: 'Is the property still available?',
      date: '1 day ago',
      status: 'replied'
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onAuthClick={handleAuthClick} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Access Required</h2>
              <p className="text-gray-600 mb-6">
                Please log in to access your landlord dashboard
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Landlord Dashboard</h1>
            <p className="text-gray-600">Manage your properties and connect with tenants</p>
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
                  <p className="text-2xl font-bold">₹37,000</p>
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
                  <p className="text-2xl font-bold">236</p>
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
                  <p className="text-2xl font-bold">11</p>
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
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList>
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
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
                              {property.status === 'active' ? 'Active' : 'Rented'}
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
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inquiries" className="space-y-6">
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <Card key={inquiry.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{inquiry.tenant}</h3>
                          <Badge variant={inquiry.status === 'new' ? 'default' : 'secondary'}>
                            {inquiry.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{inquiry.property}</p>
                        <p className="text-gray-700">{inquiry.message}</p>
                        <p className="text-xs text-gray-500">{inquiry.date}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Reply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
    </div>
  );
};

export default Dashboard;
