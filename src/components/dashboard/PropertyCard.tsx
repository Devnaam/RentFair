
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  MessageSquare, 
  Star, 
  Edit, 
  Trash2,
  Send
} from 'lucide-react';
import { PropertyWithStats } from '@/services/dashboardService';

interface PropertyCardProps {
  property: PropertyWithStats;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onPublish: (id: string) => void;
  onDelete: (id: string) => void;
  isPublishing: boolean;
  isDeleting: boolean;
}

const PropertyCard = ({ 
  property, 
  onEdit, 
  onView, 
  onPublish, 
  onDelete, 
  isPublishing, 
  isDeleting 
}: PropertyCardProps) => {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
          <div className="space-y-3 sm:space-y-4 flex-1">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h3 className="text-lg sm:text-xl font-semibold">{property.title}</h3>
                <Badge variant={property.status === 'active' ? 'default' : 'secondary'} className="w-fit">
                  {property.status === 'active' ? 'Active' : property.status}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">{property.location}</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">₹{property.rent.toLocaleString()}/month</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
              <div className="flex items-center">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">{property.views}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Views this week</p>
                </div>
              </div>
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">{property.inquiries}</p>
                  <p className="text-xs sm:text-sm text-gray-600">New inquiries</p>
                </div>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-2" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">{property.rating}</p>
                  <p className="text-xs sm:text-sm text-gray-600">({property.reviews} reviews)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 lg:flex-col lg:min-w-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(property.id)}
              className="flex-1 sm:flex-none"
            >
              <Edit className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onView(property.id)}
              className="flex-1 sm:flex-none"
            >
              <Eye className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">View</span>
            </Button>
            {property.status === 'draft' && (
              <Button 
                size="sm"
                onClick={() => onPublish(property.id)}
                disabled={isPublishing}
                className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
              >
                <Send className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Publish</span>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(property.id)}
              disabled={isDeleting}
              className="flex-1 sm:flex-none"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
