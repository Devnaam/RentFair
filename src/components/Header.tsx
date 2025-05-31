
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, User, Search, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  onAuthClick: (type: 'login' | 'signup') => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">RentFair</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors">
                How It Works
              </a>
              <a href="#for-tenants" className="text-gray-700 hover:text-primary transition-colors">
                For Tenants
              </a>
              <a href="#for-landlords" className="text-gray-700 hover:text-primary transition-colors">
                For Landlords
              </a>
              <a href="#safety" className="text-gray-700 hover:text-primary transition-colors">
                Safety
              </a>
            </nav>
          )}

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            {!isMobile && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onAuthClick('login')}
                  className="text-gray-700 hover:text-primary"
                >
                  Login
                </Button>
                <Button
                  onClick={() => onAuthClick('signup')}
                  className="bg-primary hover:bg-primary-dark text-white"
                >
                  Get Started
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                <User className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors py-2">
                How It Works
              </a>
              <a href="#for-tenants" className="text-gray-700 hover:text-primary transition-colors py-2">
                For Tenants
              </a>
              <a href="#for-landlords" className="text-gray-700 hover:text-primary transition-colors py-2">
                For Landlords
              </a>
              <a href="#safety" className="text-gray-700 hover:text-primary transition-colors py-2">
                Safety
              </a>
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <Button
                  variant="outline"
                  onClick={() => onAuthClick('login')}
                  className="w-full"
                >
                  Login
                </Button>
                <Button
                  onClick={() => onAuthClick('signup')}
                  className="w-full bg-primary hover:bg-primary-dark text-white"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
