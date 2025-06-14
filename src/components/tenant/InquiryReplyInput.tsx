
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, RefreshCw } from 'lucide-react';

interface InquiryReplyInputProps {
  inquiryId: string;
  message: string;
  onChange: (message: string) => void;
  onSend: () => void;
  isSending: boolean;
}

const InquiryReplyInput = ({ 
  inquiryId, 
  message, 
  onChange, 
  onSend, 
  isSending 
}: InquiryReplyInputProps) => {
  return (
    <div className="mb-3">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your reply..."
          value={message}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <Button
          size="sm"
          onClick={onSend}
          disabled={isSending || !message.trim()}
          className="text-xs sm:text-sm h-10"
        >
          {isSending ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default InquiryReplyInput;
