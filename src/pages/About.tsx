
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Home, Target, Award, Zap } from 'lucide-react';
import AuthModal from '@/components/AuthModal';

const About = () => {
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

  const values = [
    {
      icon: Heart,
      title: "Transparency",
      description: "Complete honesty in all property listings and transactions"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building trust between landlords and tenants"
    },
    {
      icon: Home,
      title: "Quality",
      description: "Only verified, quality properties make it to our platform"
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Using technology to solve real rental market problems"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Properties Listed" },
    { number: "50,000+", label: "Happy Users" },
    { number: "15+", label: "Cities Covered" },
    { number: "98%", label: "User Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthClick={handleAuthClick} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Making Rental Housing Fair & Transparent
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            RentFair was founded with a simple mission: to eliminate scams and create a transparent, 
            fair rental marketplace where both landlords and tenants can connect with confidence.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                  We believe everyone deserves access to safe, affordable, and transparent rental housing. 
                  Our platform connects verified landlords with genuine tenants, eliminating the middlemen, 
                  hidden fees, and fraudulent listings that plague the rental market.
                </p>
                <p className="text-gray-700">
                  Through rigorous verification processes, transparent pricing, and community-driven reviews, 
                  we're building the future of rental housing in India.
                </p>
              </div>
              <div className="bg-primary/5 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-primary">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                RentFair was born out of personal frustration with the rental market. Our founders, 
                like millions of students and professionals, faced countless scams, hidden fees, 
                and dishonest brokers while searching for housing.
              </p>
              <p className="text-gray-700 mb-4">
                After experiencing broker fees that were never disclosed, properties that didn't match 
                their photos, and landlords who disappeared after taking deposits, we decided something 
                had to change.
              </p>
              <p className="text-gray-700">
                Today, RentFair has helped thousands of people find honest, transparent rental housing 
                across India. We're just getting started on our mission to transform the rental market 
                for everyone.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h2>
            <p className="text-gray-600 mb-6">
              Whether you're looking for a place to call home or have a property to rent, 
              join thousands of users who trust RentFair for honest rental experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => handleAuthClick('signup')}>
                Get Started Today
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/help'}>
                Contact Us
              </Button>
            </div>
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

export default About;
