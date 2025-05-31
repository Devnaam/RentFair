
import React from 'react';
import { Shield, Users, MapPin, MessageSquare, Star, TrendingUp, Clock, Eye } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Scam-Free Platform',
      description: 'Verified listings and landlords. No fake properties or misleading information.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: TrendingUp,
      title: 'AI Fair Pricing',
      description: 'Smart algorithms analyze market rates to flag overpriced listings.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: MapPin,
      title: 'Smart Location Search',
      description: 'Find rooms near your college, office, or preferred landmarks with travel time estimates.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Star,
      title: 'Dual Review System',
      description: 'Rate properties and landlords, while landlords can review tenants for transparency.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      icon: MessageSquare,
      title: 'Secure Messaging',
      description: 'Communicate directly with landlords through our secure in-app chat system.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'Built specifically for students, job seekers, and young professionals.',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      icon: Clock,
      title: 'Flexible Terms',
      description: 'Find short-term (1-3 months) to long-term rental options that suit your needs.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: Eye,
      title: 'Complete Transparency',
      description: 'No hidden fees, clear breakdowns, and honest property descriptions.',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose RentFair?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing the rental market with technology and transparency, 
            making it safer and fairer for everyone involved.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
