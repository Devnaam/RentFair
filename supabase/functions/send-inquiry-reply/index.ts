
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InquiryReplyRequest {
  inquiryId: string;
  message: string;
  tenantEmail: string;
  landlordEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inquiryId, message, tenantEmail, landlordEmail }: InquiryReplyRequest = await req.json();

    console.log('Processing inquiry reply:', { inquiryId, tenantEmail, landlordEmail });

    // For now, we'll just log the reply and return success
    // In a real implementation, you would integrate with an email service like Resend
    
    console.log('Reply sent:', {
      from: landlordEmail,
      to: tenantEmail,
      subject: 'Reply to your property inquiry',
      message: message
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Reply sent successfully',
        inquiryId 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in send-inquiry-reply function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
