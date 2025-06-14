
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Reply } from 'lucide-react';

interface InquiryRepliesProps {
  replies: any[];
  formatDate: (dateString: string) => string;
}

const InquiryReplies = ({ replies, formatDate }: InquiryRepliesProps) => {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="mb-3">
      <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
        <Reply className="w-4 h-4 text-purple-600" />
        Conversation:
      </h4>
      <div className="space-y-2">
        {replies.map((reply: any) => (
          <div 
            key={reply.id} 
            className={`p-2 sm:p-3 rounded-lg border-l-4 ${
              reply.sender_type === 'landlord' 
                ? 'bg-blue-50 border-blue-500' 
                : 'bg-green-50 border-green-500'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {reply.sender_type === 'landlord' ? 'Landlord' : 'You'}
              </Badge>
              <span className="text-xs text-gray-500">
                {formatDate(reply.created_at)}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {reply.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InquiryReplies;
