
import React, { useState } from 'react';
import { Image } from 'lucide-react';

interface PropertyImageDisplayProps {
  photos: string[];
  title: string;
}

const PropertyImageDisplay: React.FC<PropertyImageDisplayProps> = ({ photos, title }) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageError = () => {
    if (currentImageIndex < photos.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setImageError(true);
    }
  };

  if (!photos || photos.length === 0 || imageError) {
    return (
      <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <Image className="w-6 h-6 text-gray-500" />
          </div>
          <p className="text-sm text-gray-500">Property Photos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={photos[currentImageIndex]}
        alt={`${title} - Photo ${currentImageIndex + 1}`}
        className="w-full h-32 object-cover rounded-lg"
        onError={handleImageError}
      />
      {photos.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {currentImageIndex + 1}/{photos.length}
        </div>
      )}
    </div>
  );
};

export default PropertyImageDisplay;
