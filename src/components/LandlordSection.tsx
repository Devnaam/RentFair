
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Shield, MessageSquare, Star, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandlordSection: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Higher Occupancy Rates',
      description: 'Reach verified tenants actively looking for quality accommodations'
    },
    {
      icon: Shield,
      title: 'Verified Tenants',
      description: 'Connect with background-checked, reliable tenants through our screening process'
    },
    {
      icon: Star,
      title: 'Build Your Reputation',
      description: 'Collect authentic reviews and build trust with potential tenants'
    },
    {
      icon: MessageSquare,
      title: 'Direct Communication',
      description: 'Engage directly with interested tenants through secure messaging'
    },
    {
      icon: Eye,
      title: 'Complete Transparency',
      description: 'Showcase your property honestly and attract the right tenants'
    },
    {
      icon: Plus,
      title: 'Easy Listing Management',
      description: 'Simple tools to create, edit, and manage your property listings'
    }
  ];

  return (
    <section id="for-landlords" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              List Your Property on RentFair
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join our community of trusted landlords and connect with quality tenants. 
              Our platform helps you rent faster while maintaining transparency and trust.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <benefit.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3"
                onClick={() => navigate('/list-property')}
              >
                <Plus className="w-5 h-5 mr-2" />
                List Your Property
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                Learn More
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Property Listing</h3>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </div>
                </div>
                
                <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Property Photos</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Rent</span>
                    <span className="font-semibold text-gray-900">₹12,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Views This Week</span>
                    <span className="font-semibold text-primary">147</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Inquiries</span>
                    <span className="font-semibold text-green-600">8 New</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900 ml-1">4.8</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-primary hover:bg-primary-dark text-white"
                  onClick={() => navigate('/dashboard')}
                >
                  View Full Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandlordSection;
