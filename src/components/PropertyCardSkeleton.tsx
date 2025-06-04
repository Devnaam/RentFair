
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PropertyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        
        <Skeleton className="h-32 w-full rounded-lg" />
        
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
