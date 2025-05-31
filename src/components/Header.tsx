
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, User, LogOut, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onAuthClick: (type: 'login' | 'signup') => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const handleListProperty = () => {
    if (!user) {
      onAuthClick('signup');
    } else {
      navigate('/list-property');
    }
    setIsMenuOpen(false);
  };

  const getUserInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
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
            {!loading && (
              <>
                {!user ? (
                  <>
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
                          onClick={handleListProperty}
                          className="bg-primary hover:bg-primary-dark text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          List Property
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {!isMobile && (
                      <div className="flex items-center space-x-3">
                        <Button
                          onClick={handleListProperty}
                          className="bg-primary hover:bg-primary-dark text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          List Property
                        </Button>
                        <span className="text-sm text-gray-600">
                          Welcome back!
                        </span>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-white text-xs">
                            {getUserInitials(user.user_metadata?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSignOut}
                          className="text-gray-700 hover:text-primary"
                        >
                          <LogOut className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
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
                {user ? (
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary text-white text-xs">
                      {getUserInitials(user.user_metadata?.name)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="w-5 h-5" />
                )}
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
                {!user ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => { onAuthClick('login'); setIsMenuOpen(false); }}
                      className="w-full"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={handleListProperty}
                      className="w-full bg-primary hover:bg-primary-dark text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      List Property
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleListProperty}
                      className="w-full bg-primary hover:bg-primary-dark text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      List Property
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSignOut}
                      className="w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
