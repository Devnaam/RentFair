
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search } from 'lucide-react';
import InquiryCard from './InquiryCard';

interface InquiriesListProps {
  inquiries: any[] | undefined;
  isLoading: boolean;
  replyMessages: { [key: string]: string };
  sendingReply: { [key: string]: boolean };
  formatDate: (dateString: string) => string;
  onReplyChange: (inquiryId: string, message: string) => void;
  onSendReply: (inquiryId: string) => void;
  onViewProperty: (propertyId: string) => void;
  onBrowseProperties: () => void;
}

const InquiriesList = ({
  inquiries,
  isLoading,
  replyMessages,
  sendingReply,
  formatDate,
  onReplyChange,
  onSendReply,
  onViewProperty,
  onBrowseProperties
}: InquiriesListProps) => {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Your Recent Inquiries</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : inquiries && inquiries.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {inquiries.map((inquiry: any) => (
              <InquiryCard
                key={inquiry.id}
                inquiry={inquiry}
                formatDate={formatDate}
                replyMessage={replyMessages[inquiry.id] || ''}
                onReplyChange={(message) => onReplyChange(inquiry.id, message)}
                onSendReply={() => onSendReply(inquiry.id)}
                isSending={sendingReply[inquiry.id] || false}
                onViewProperty={onViewProperty}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No inquiries yet</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Start exploring properties and send inquiries to landlords.
            </p>
            <Button onClick={onBrowseProperties}>
              <Search className="w-4 h-4 mr-2" />
              Browse Properties
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InquiriesList;
