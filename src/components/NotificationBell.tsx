
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch recent inquiries for notifications
  const { data: recentInquiries } = useQuery({
    queryKey: ['recent-inquiries', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('property_inquiries')
        .select(`
          *,
          property_listings!inner(
            title,
            landlord_id
          ),
          profiles!property_inquiries_tenant_id_fkey(
            name
          )
        `)
        .eq('property_listings.landlord_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
    refetchInterval: 30000 // Refetch every 30 seconds for real-time updates
  });

  useEffect(() => {
    if (recentInquiries) {
      // Count inquiries from the last 24 hours as "new"
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const newInquiries = recentInquiries.filter(
        inquiry => new Date(inquiry.created_at) > yesterday
      );
      
      setUnreadCount(newInquiries.length);
    }
  }, [recentInquiries]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-3 border-b">
          <h3 className="font-semibold">Recent Inquiries</h3>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600">{unreadCount} new inquiry{unreadCount > 1 ? 'ies' : 'y'}</p>
          )}
        </div>
        {recentInquiries && recentInquiries.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            {recentInquiries.map((inquiry: any) => (
              <DropdownMenuItem
                key={inquiry.id}
                className="p-3 cursor-pointer hover:bg-gray-50"
                onClick={() => navigate('/inquiries')}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {inquiry.profiles?.name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(inquiry.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    Interested in: {inquiry.property_listings?.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {inquiry.message}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent inquiries</p>
          </div>
        )}
        <div className="p-3 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => navigate('/inquiries')}
          >
            View All Inquiries
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
