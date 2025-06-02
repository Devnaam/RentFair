
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; timestamp: Date }[]>([
    {
      text: "Hello! I'm here to help you with any questions about RentFair. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const { toast } = useToast();

  const sendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = { text: message, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        text: "Thank you for your message! A support agent will respond to you shortly. For immediate assistance, please call us at +91 6205791382 or email workwithdevnaam@gmail.com",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setMessage('');
    toast({
      title: "Message sent",
      description: "We'll get back to you soon!"
    });
  };

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700"
          >
            <MessageSquare className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-80 h-96 shadow-xl">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-sm">RentFair Support</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-700 h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-2 rounded-lg text-sm ${
                        msg.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Input */}
              <div className="p-3 border-t flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default LiveChatWidget;
