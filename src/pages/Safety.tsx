
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, AlertTriangle, Eye, Users, Lock } from 'lucide-react';
import AuthModal from '@/components/AuthModal';

const Safety = () => {
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

  const safetyFeatures = [
    {
      icon: Shield,
      title: "Verified Properties",
      description: "All properties are physically verified by our team before listing",
      color: "text-green-600"
    },
    {
      icon: Users,
      title: "Background Checks",
      description: "Both landlords and tenants undergo identity and background verification",
      color: "text-blue-600"
    },
    {
      icon: Eye,
      title: "Photo Verification",
      description: "Real photos of properties, not stock images or misleading pictures",
      color: "text-purple-600"
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "All transactions are secured and monitored for fraud protection",
      color: "text-orange-600"
    }
  ];

  const safetyTips = [
    "Always visit the property in person before making any payments",
    "Verify the landlord's identity and ownership documents",
    "Never pay large amounts without a proper receipt",
    "Meet in safe, public locations for initial discussions",
    "Trust your instincts - if something feels wrong, report it",
    "Keep all communication and agreements in writing"
  ];

  const redFlags = [
    "Landlord refuses to meet in person or show the property",
    "Demands immediate payment without proper documentation",
    "Price significantly below market rate for the area",
    "Poor quality or suspicious-looking photos",
    "Pressure to make quick decisions without time to think",
    "Requests for payments to overseas accounts"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthClick={handleAuthClick} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Safety is Our Priority</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            RentFair implements multiple layers of security and verification to ensure safe, 
            transparent, and scam-free rental experiences for everyone.
          </p>
        </div>

        {/* Safety Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {safetyFeatures.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Safety Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Safety Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {safetyTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Red Flags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Red Flags to Watch For
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {redFlags.map((flag, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{flag}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Report Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Report Suspicious Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-700 mb-2">
                  If you encounter any suspicious activity, scams, or safety concerns, please report it immediately.
                </p>
                <p className="text-sm text-gray-600">
                  Our team reviews all reports within 24 hours and takes appropriate action.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Report Issue</Button>
                <Button>Emergency Contact</Button>
              </div>
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

export default Safety;
