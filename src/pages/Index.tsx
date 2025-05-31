
import React, { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import UserCategoriesSection from '@/components/UserCategoriesSection';
import LandlordSection from '@/components/LandlordSection';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

const Index = () => {
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

  return (
    <div className="min-h-screen bg-white">
      <Header onAuthClick={handleAuthClick} />
      <HeroSection />
      <FeaturesSection />
      <UserCategoriesSection />
      <LandlordSection />
      <Footer />
      
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialType={authModal.type}
      />
    </div>
  );
};

export default Index;
