
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListingPolicy = () => {
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
            <CardTitle className="text-3xl font-bold text-center">Listing Policy</CardTitle>
            <p className="text-center text-gray-600 mt-2">Guidelines for creating quality property listings</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Quality Standards</h2>
              <p className="text-gray-700 mb-4">
                To maintain the quality of our platform and provide the best experience for tenants, 
                all property listings must meet the following standards:
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                What's Allowed
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Property Information</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                    <li>Accurate property descriptions</li>
                    <li>Current and high-quality photos</li>
                    <li>Exact location details</li>
                    <li>Realistic pricing</li>
                    <li>Clear availability dates</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Property Types</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                    <li>Residential apartments and houses</li>
                    <li>Individual rooms in shared accommodations</li>
                    <li>PG and hostel accommodations</li>
                    <li>Furnished and unfurnished properties</li>
                    <li>Commercial spaces (with proper permits)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                What's Not Allowed
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Prohibited Content</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                    <li>Fake or misleading photos</li>
                    <li>Incorrect location information</li>
                    <li>Properties you don't own or have authority to rent</li>
                    <li>Duplicate listings</li>
                    <li>Inappropriate or offensive content</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Property Restrictions</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                    <li>Illegal or unsafe accommodations</li>
                    <li>Properties without proper permits</li>
                    <li>Overcrowded spaces</li>
                    <li>Properties with discriminatory restrictions</li>
                    <li>Extremely overpriced listings</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Photo Guidelines</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Required Photos:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                  <li>At least 3 clear, well-lit photos</li>
                  <li>Main living area or bedroom</li>
                  <li>Kitchen and bathroom</li>
                  <li>Building exterior or entrance</li>
                </ul>
                <h3 className="font-medium mb-2 mt-4">Photo Quality:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                  <li>High resolution (minimum 800x600 pixels)</li>
                  <li>Good lighting and clear visibility</li>
                  <li>Recent photos (taken within last 6 months)</li>
                  <li>No watermarks or promotional text</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Pricing Guidelines</h2>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                  <li>Set competitive and fair market prices</li>
                  <li>Clearly state all additional fees upfront</li>
                  <li>Be transparent about security deposits</li>
                  <li>Honor the prices listed on your property</li>
                  <li>Update pricing if market conditions change</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Communication Standards</h2>
              <p className="text-gray-700 mb-3">
                Landlords are expected to maintain professional and timely communication:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                <li>Respond to inquiries within 24 hours</li>
                <li>Provide accurate and helpful information</li>
                <li>Be respectful and professional in all communications</li>
                <li>Honor scheduled viewings and appointments</li>
                <li>Keep tenants informed of any changes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Compliance and Legal Requirements</h2>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800 font-medium mb-2">
                  Important: Landlords must ensure compliance with local laws
                </p>
                <ul className="list-disc pl-6 text-red-700 space-y-1 text-sm">
                  <li>Valid rental licenses and permits</li>
                  <li>Compliance with local rent control laws</li>
                  <li>Proper safety certifications</li>
                  <li>Non-discriminatory rental practices</li>
                  <li>Tenant rights and privacy protections</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Enforcement</h2>
              <p className="text-gray-700 mb-3">
                Violations of this policy may result in:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                <li>Listing removal or suspension</li>
                <li>Account warnings or restrictions</li>
                <li>Permanent account termination for serious violations</li>
                <li>Reporting to relevant authorities if required</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Getting Help</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these policies or need help with your listing, 
                please contact our support team through the Help page or email us at support@rentfair.com.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListingPolicy;
