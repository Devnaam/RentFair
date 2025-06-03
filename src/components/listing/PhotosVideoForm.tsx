
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, Image } from 'lucide-react';
import { ListingFormData } from '@/types/listing';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PhotosVideoFormProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
}

const PhotosVideoForm: React.FC<PhotosVideoFormProps> = ({ formData, updateFormData }) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadPhoto = async (file: File) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('User not authenticated');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.data.user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error } = await supabase.storage
        .from('property-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      const { data } = supabase.storage
        .from('property-photos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadPhoto:', error);
      throw error;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(file => {
        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          throw new Error(`Invalid file type: ${file.type}`);
        }
        
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File too large: ${file.name}`);
        }
        
        return uploadPhoto(file);
      });
      
      const urls = await Promise.all(uploadPromises);
      
      updateFormData({
        photos: [...formData.photos, ...urls]
      });
      
      toast({
        title: "Photos uploaded successfully!",
        description: `${files.length} photo(s) added to your listing.`
      });
    } catch (error: any) {
      console.error('Error uploading photos:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload photos. Please try again."
      });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (index: number) => {
    const photoUrl = formData.photos[index];
    
    try {
      // Extract file path from URL
      const urlParts = photoUrl.split('/');
      const fileName = urlParts[urlParts.length - 2] + '/' + urlParts[urlParts.length - 1];
      
      // Delete from storage
      await supabase.storage
        .from('property-photos')
        .remove([fileName]);
      
      const updatedPhotos = formData.photos.filter((_, i) => i !== index);
      updateFormData({ photos: updatedPhotos });
      
      toast({
        title: "Photo removed",
        description: "Photo has been deleted successfully."
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove photo. Please try again."
      });
    }
  };

  const validateVideoUrl = (url: string) => {
    if (!url) return true;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/\d+/;
    return youtubeRegex.test(url) || vimeoRegex.test(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photos & Video</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Photo Upload */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Property Photos * (minimum 3, recommended 5+)</Label>
            <span className="text-sm text-gray-500">
              {formData.photos.length} photo(s) uploaded
            </span>
          </div>
          
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Drag and drop photos here, or click to browse
              </p>
              <p className="text-xs text-gray-500">
                Optimal aspect ratio: 16:9 or 4:3 | Max size: 5MB per photo | Formats: JPEG, PNG, WebP
              </p>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="photo-upload"
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Browse Files'}
              </Button>
            </div>
          </div>

          {/* Photo Preview Grid */}
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                      Main Photo
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {formData.photos.length < 3 && (
            <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
              ⚠️ Please upload at least 3 photos to publish your listing.
            </p>
          )}
        </div>

        {/* Video Tour URL */}
        <div className="space-y-2">
          <Label htmlFor="video_tour_url">Video Tour Link (Optional)</Label>
          <Input
            id="video_tour_url"
            value={formData.video_tour_url}
            onChange={(e) => updateFormData({ video_tour_url: e.target.value })}
            placeholder="YouTube or Vimeo URL (e.g., https://www.youtube.com/watch?v=...)"
          />
          {formData.video_tour_url && !validateVideoUrl(formData.video_tour_url) && (
            <p className="text-sm text-red-600">
              Please enter a valid YouTube or Vimeo URL.
            </p>
          )}
          <p className="text-xs text-gray-500">
            Adding a video tour can increase tenant interest by up to 40%!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotosVideoForm;
