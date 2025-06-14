
import { supabase } from '@/integrations/supabase/client';
import { PropertyWithStats } from './types/dashboard';

export const deleteProperty = async (propertyId: string): Promise<void> => {
  const { error } = await supabase
    .from('property_listings')
    .delete()
    .eq('id', propertyId);

  if (error) throw error;
};

export const updatePropertyStatus = async (propertyId: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('property_listings')
    .update({ status })
    .eq('id', propertyId);

  if (error) throw error;
};

export const incrementPropertyViews = async (propertyId: string): Promise<void> => {
  try {
    // First get the current views count
    const { data: currentData } = await supabase
      .from('property_listings')
      .select('views_count')
      .eq('id', propertyId)
      .single();

    const currentViews = currentData?.views_count || 0;

    // Then update with incremented value
    const { error } = await supabase
      .from('property_listings')
      .update({ views_count: currentViews + 1 })
      .eq('id', propertyId);

    if (error) console.error('Error incrementing views:', error);
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
};

export const fetchRandomProperty = async (): Promise<PropertyWithStats | null> => {
  try {
    const { data, error } = await supabase
      .from('property_listings')
      .select('*')
      .eq('status', 'active')
      .limit(1)
      .single();

    if (error || !data) return null;

    const validStatuses: Array<'active' | 'inactive' | 'rented' | 'pending_review' | 'draft'> = 
      ['active', 'inactive', 'rented', 'pending_review', 'draft'];
    const status = validStatuses.includes(data.status as any) ? 
      data.status as 'active' | 'inactive' | 'rented' | 'pending_review' | 'draft' : 'active';

    return {
      id: data.id,
      title: data.title || `${data.property_type} in ${data.city}`,
      location: `${data.city}, ${data.state}`,
      rent: data.monthly_rent,
      status,
      views: data.views_count || 0,
      inquiries: 0,
      rating: 4.5,
      reviews: 0,
      photos: Array.isArray(data.photos) ? data.photos : []
    };
  } catch (error) {
    console.error('Error fetching random property:', error);
    return null;
  }
};
