
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
    console.log('Attempting to send support email:', emailData);
    
    const { data, error } = await supabase.functions.invoke('send-support-email', {
      body: emailData
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }

    console.log('Support email sent successfully:', data);
  } catch (error) {
    console.error('Error sending support email:', error);
    // Re-throw the error so the component can handle it
    throw error;
  }
};

// Fallback function to open email client directly
export const openEmailClient = (emailData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): void => {
  const subject = encodeURIComponent(`Support Request: ${emailData.subject}`);
  const body = encodeURIComponent(
    `Name: ${emailData.name}\n` +
    `Email: ${emailData.email}\n\n` +
    `Message:\n${emailData.message}\n\n` +
    `--\nSent from RentFair Help Form`
  );
  
  window.open(`mailto:workwithdevnaam@gmail.com?subject=${subject}&body=${body}`, '_self');
};
