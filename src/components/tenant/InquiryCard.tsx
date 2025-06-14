
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  IndianRupee, 
  Home, 
  Bath, 
  Eye, 
  CheckCircle 
} from 'lucide-react';
import InquiryReplies from './InquiryReplies';
import InquiryReplyInput from './InquiryReplyInput';

interface InquiryCardProps {
  inquiry: any;
  formatDate: (dateString: string) => string;
  replyMessage: string;
  onReplyChange: (message: string) => void;
  onSendReply: () => void;
  isSending: boolean;
  onViewProperty: (propertyId: string) => void;
}

const InquiryCard = ({ 
  inquiry, 
  formatDate, 
  replyMessage, 
  onReplyChange, 
  onSendReply, 
  isSending, 
  onViewProperty 
}: InquiryCardProps) => {
  return (
    <div className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Property Image */}
        {inquiry.property_listings?.photos?.[0] && (
          <img
            src={inquiry.property_listings.photos[0]}
            alt="Property"
            className="w-full lg:w-24 h-48 lg:h-24 rounded-lg object-cover"
          />
        )}
        
        {/* Property Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                {inquiry.property_listings?.title}
              </h3>
              <div className="flex items-start text-xs sm:text-sm text-gray-600 mb-1">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 mt-0.5 flex-shrink-0" />
                <span className="break-words">
                  {inquiry.property_listings?.city}, {inquiry.property_listings?.state}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mr-1" />
                <span className="font-medium text-green-600 text-sm sm:text-base">
                  ₹{inquiry.property_listings?.monthly_rent?.toLocaleString()}/month
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs w-fit">
                Sent {formatDate(inquiry.created_at)}
              </Badge>
              {inquiry.replies && inquiry.replies.length > 0 && (
                <Badge className="text-xs bg-green-100 text-green-800 border-green-200 w-fit">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Replied
                </Badge>
              )}
            </div>
          </div>

          {/* Property Stats */}
          <div className="flex items-center gap-4 sm:gap-6 mb-3 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Home className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{inquiry.property_listings?.bedrooms || 'N/A'} bed</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{inquiry.property_listings?.bathrooms || 'N/A'} bath</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{inquiry.property_listings?.views_count || 0} views</span>
            </div>
          </div>

          {/* Inquiry Message */}
          <div className="bg-gray-50 p-2 sm:p-3 rounded-lg mb-3">
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              <strong>Your message:</strong> {inquiry.message}
            </p>
          </div>

          {/* Replies */}
          <InquiryReplies replies={inquiry.replies} formatDate={formatDate} />

          {/* Reply Input */}
          <InquiryReplyInput
            inquiryId={inquiry.id}
            message={replyMessage}
            onChange={onReplyChange}
            onSend={onSendReply}
            isSending={isSending}
          />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProperty(inquiry.property_listings?.id)}
              className="text-xs sm:text-sm h-8 sm:h-9"
            >
              View Property
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProperty(inquiry.property_listings?.id)}
              className="text-xs sm:text-sm h-8 sm:h-9"
            >
              Contact Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryCard;
