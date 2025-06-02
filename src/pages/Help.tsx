
import React, { useState } from 'react';
import Header from '@/components/Header';
import LiveChatWidget from '@/components/LiveChatWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageSquare, Phone, Mail, Clock } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { submitSupportTicket, sendSupportEmail } from '@/services/supportService';

const Help = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    type: 'login' | 'signup';
  }>({
    isOpen: false,
    type: 'login'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, type });
  };

  const closeAuthModal = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields."
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit support ticket to database
      await submitSupportTicket({
        ...formData,
        user_id: user?.id
      });

      // Send email notification
      await sendSupportEmail(formData);

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours at " + formData.email
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again or contact us directly at workwithdevnaam@gmail.com"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneCall = () => {
    window.open('tel:+916205791382', '_self');
    toast({
      title: "Calling...",
      description: "Opening phone dialer for +91 6205791382"
    });
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent('RentFair Support Request');
    const body = encodeURIComponent('Hello RentFair Support Team,\n\nI need assistance with:\n\n[Please describe your issue]\n\nBest regards');
    window.open(`mailto:workwithdevnaam@gmail.com?subject=${subject}&body=${body}`, '_self');
    
    toast({
      title: "Email client opened",
      description: "Opening your default email client"
    });
  };

  const faqs = [
    {
      question: "How do I list my property on RentFair?",
      answer: "Simply click on 'List Property' button, create an account as a landlord, and fill out the property details form. Your listing will be reviewed and published within 24 hours."
    },
    {
      question: "Is RentFair free to use?",
      answer: "Yes, RentFair is completely free for tenants to search and connect with landlords. Landlords can list properties for free with basic features."
    },
    {
      question: "How do you verify properties and users?",
      answer: "We verify all properties through document checks and physical verification. Users are verified through phone and email verification, plus background checks for enhanced safety."
    },
    {
      question: "What if I face issues with a landlord or tenant?",
      answer: "Contact our support team immediately. We have a dispute resolution process and will help mediate any issues between parties."
    },
    {
      question: "How do I report a scam or fraudulent listing?",
      answer: "Use the 'Report' button on any listing or contact our support team directly. We take fraud very seriously and investigate all reports promptly."
    },
    {
      question: "How can I contact RentFair support?",
      answer: "You can reach us via phone (+91 6205791382), email (workwithdevnaam@gmail.com), live chat, or by filling out the contact form on this page."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthClick={handleAuthClick} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600">We're here to help you with any questions or issues</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Options */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Get instant help from our support team</p>
                <Button className="w-full" onClick={() => {}}>
                  Start Chat
                </Button>
                <p className="text-xs text-gray-500 mt-2">Chat widget available in bottom right corner</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">+91 6205791382</p>
                <p className="text-sm text-gray-500 mb-4">Mon-Sat, 9 AM - 8 PM</p>
                <Button variant="outline" className="w-full" onClick={handlePhoneCall}>
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">workwithdevnaam@gmail.com</p>
                <p className="text-sm text-gray-500 mb-4">Response within 24 hours</p>
                <Button variant="outline" className="w-full" onClick={handleSendEmail}>
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitForm} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input 
                        id="name" 
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input 
                      id="subject" 
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Describe your issue or question" 
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <LiveChatWidget />

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialType={authModal.type}
      />
    </div>
  );
};

export default Help;
