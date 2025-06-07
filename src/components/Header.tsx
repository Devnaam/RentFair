
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Menu, X, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import NotificationBell from '@/components/NotificationBell';

interface HeaderProps {
  onAuthClick: (type: 'login' | 'signup') => void;
}

const Header = ({ onAuthClick }: HeaderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch user profile to check if they're a landlord
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out"
      });
    } else {
      toast({
        title: "Logged out successfully"
      });
      navigate('/');
    }
  };

  const isLandlord = userProfile?.role === 'landlord';

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Home className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">RentFair</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/find-room" className="text-gray-700 hover:text-blue-600 transition-colors">
              Find Room
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link to="/safety" className="text-gray-700 hover:text-blue-600 transition-colors">
              Safety
            </Link>
            <Link to="/help" className="text-gray-700 hover:text-blue-600 transition-colors">
              Help
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell for Landlords */}
            {user && isLandlord && <NotificationBell />}
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/list-property')}
                  className="hidden sm:flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  List Property
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/list-property')}
                  className="hidden sm:flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  List Property
                </Button>
                <div className="hidden sm:flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onAuthClick('login')}>
                    Login
                  </Button>
                  <Button size="sm" onClick={() => onAuthClick('signup')}>
                    Sign Up
                  </Button>
                </div>
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/find-room" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Find Room
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/safety" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Safety
              </Link>
              <Link 
                to="/help" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Help
              </Link>
              
              <div className="pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    navigate('/list-property');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mb-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  List Property
                </Button>
                
                {user ? (
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        onAuthClick('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Login
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        onAuthClick('signup');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Sign Up
                    </Button>
                  </div>
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
