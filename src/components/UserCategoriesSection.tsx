
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, User, Home, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserCategoriesSection: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'students',
      icon: Users,
      title: 'College Students',
      description: 'Find student-friendly accommodations near your campus',
      features: ['Near campus search', 'Student-only properties', 'Study-friendly spaces', 'Budget-friendly options'],
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      id: 'professionals',
      icon: Briefcase,
      title: 'Job Seekers & Professionals',
      description: 'Quick, furnished rentals for working professionals',
      features: ['Near office locations', 'Move-in ready spaces', 'Professional communities', 'Flexible lease terms'],
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      id: 'women',
      icon: Shield,
      title: 'Single Women',
      description: 'Safe, verified accommodations with enhanced security',
      features: ['Female-only properties', 'Verified female landlords', 'Safety ratings', 'Secure neighborhoods'],
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100'
    },
    {
      id: 'groups',
      icon: Home,
      title: 'Groups & Families',
      description: 'Spacious accommodations for shared living',
      features: ['Multi-bedroom options', 'Group-friendly policies', 'Split rent calculations', 'Family neighborhoods'],
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100'
    },
    {
      id: 'short-term',
      icon: Clock,
      title: 'Short-term Renters',
      description: 'Flexible 1-3 month stays for tourists and freelancers',
      features: ['Short-term leases', 'Fully furnished', 'High-speed internet', 'All utilities included'],
      color: 'bg-teal-50 border-teal-200',
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-100'
    },
    {
      id: 'emergency',
      icon: User,
      title: 'Emergency Renters',
      description: 'Immediate accommodation for urgent housing needs',
      features: ['24-48 hour availability', 'Quick verification', 'Emergency support', 'Instant booking'],
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100'
    }
  ];

  return (
    <section id="for-tenants" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Perfect for Every Renter
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a student, professional, or anyone in between, 
            RentFair has tailored solutions for your unique housing needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1 ${category.color}`}
            >
              <div className={`w-16 h-16 ${category.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                <category.icon className={`w-8 h-8 ${category.iconColor}`} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {category.title}
              </h3>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                {category.description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {category.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button
                variant="outline"
                className={`w-full ${category.iconColor} border-current hover:bg-white/50`}
                onClick={() => navigate('/find-room')}
              >
                Find My Room
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserCategoriesSection;
