
import React from 'react';
import { Home, MessageSquare, Shield, Star } from 'lucide-react';

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: 'For Tenants',
      links: [
        'Search Properties',
        'How It Works',
        'Safety Guidelines',
        'Pricing Guide',
        'Student Housing',
        'Professional Housing'
      ]
    },
    {
      title: 'For Landlords',
      links: [
        'List Your Property',
        'Landlord Resources',
        'Verification Process',
        'Success Stories',
        'Pricing Tools',
        'Property Management'
      ]
    },
    {
      title: 'Company',
      links: [
        'About RentFair',
        'Our Mission',
        'Careers',
        'Press',
        'Contact Us',
        'Blog'
      ]
    },
    {
      title: 'Support',
      links: [
        'Help Center',
        'Customer Support',
        'Report an Issue',
        'Terms of Service',
        'Privacy Policy',
        'Community Guidelines'
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">RentFair</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Making rental housing transparent, fair, and scam-free for students and professionals across India.
            </p>
            
            {/* Trust Badges */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Verified Listings</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Trusted Reviews</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 RentFair. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              Made with ❤️ for a fairer rental market
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
