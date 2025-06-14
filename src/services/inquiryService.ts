
import { supabase } from '@/integrations/supabase/client';

export const saveInquiryReply = async (inquiryId: string, message: string, senderType: 'landlord' | 'tenant') => {
  try {
    const { data, error } = await supabase
      .from('inquiry_replies')
      .insert({
        inquiry_id: inquiryId,
        message,
        sender_type: senderType,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving inquiry reply:', error);
    throw error;
  }
};
