
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Terms and Conditions</CardTitle>
            <p className="text-center text-gray-600 mt-2">Last updated: June 3, 2025</p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using RentFair ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Platform Description</h2>
              <p className="text-gray-700 mb-4">
                RentFair is an online platform that connects property owners (landlords) with potential tenants. 
                We provide tools for listing properties, searching for rental accommodations, and facilitating communication between parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
              <div className="space-y-3">
                <h3 className="text-lg font-medium">For Landlords:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Provide accurate and truthful information about properties</li>
                  <li>Ensure all photos and descriptions are current and representative</li>
                  <li>Comply with local rental laws and regulations</li>
                  <li>Respond to inquiries in a timely manner</li>
                  <li>Honor the terms stated in your listings</li>
                </ul>
                
                <h3 className="text-lg font-medium mt-4">For Tenants:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Provide accurate personal and financial information</li>
                  <li>Respect property viewing schedules and guidelines</li>
                  <li>Communicate respectfully with landlords</li>
                  <li>Honor any agreements made through the platform</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Prohibited Activities</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Posting false, misleading, or fraudulent information</li>
                <li>Harassment or discriminatory behavior</li>
                <li>Attempting to circumvent platform fees</li>
                <li>Using automated systems to scrape data</li>
                <li>Posting inappropriate or offensive content</li>
                <li>Subletting without landlord permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Fees and Payments</h2>
              <p className="text-gray-700 mb-4">
                RentFair may charge fees for certain services. All applicable fees will be clearly disclosed before you incur them.
                We are not responsible for any fees charged directly between landlords and tenants.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
                By using our platform, you consent to our data practices as outlined in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                RentFair serves as a platform to connect landlords and tenants. We do not guarantee the accuracy of listings,
                the reliability of users, or the success of any rental arrangements. Users engage with each other at their own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                While we encourage users to resolve disputes amicably, RentFair is not responsible for mediating conflicts between landlords and tenants.
                For serious issues, we recommend seeking legal advice or contacting appropriate authorities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Account Termination</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to suspend or terminate accounts that violate these terms.
                Users may also delete their accounts at any time through their profile settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We may update these terms from time to time. Users will be notified of significant changes,
                and continued use of the platform constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these terms, please contact us at legal@rentfair.com or through our Help page.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsAndConditions;
