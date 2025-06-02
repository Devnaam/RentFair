
import { supabase } from '@/integrations/supabase/client';

export interface SupportTicket {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  user_id?: string;
  status?: 'open' | 'in_progress' | 'resolved';
  created_at?: string;
}

export const submitSupportTicket = async (ticket: SupportTicket): Promise<void> => {
  try {
    const { error } = await supabase
      .from('support_tickets')
      .insert({
        name: ticket.name,
        email: ticket.email,
        subject: ticket.subject,
        message: ticket.message,
        user_id: ticket.user_id,
        status: 'open'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error submitting support ticket:', error);
    throw error;
  }
};

export const sendSupportEmail = async (emailData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> => {
  try {
    const { error } = await supabase.functions.invoke('send-support-email', {
      body: emailData
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error sending support email:', error);
    throw error;
  }
};
