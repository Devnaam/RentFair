
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SupportEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: SupportEmailRequest = await req.json();

    console.log('Received support email request:', { name, email, subject });

    // Send email to support team
    const supportEmailResponse = await resend.emails.send({
      from: "RentFair Support <onboarding@resend.dev>",
      to: ["workwithdevnaam@gmail.com"],
      subject: `Support Request: ${subject}`,
      html: `
        <h2>New Support Request from RentFair</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <hr>
        <p style="color: #666; font-size: 12px;">This message was sent from the RentFair help form.</p>
      `,
    });

    // Send confirmation email to user
    const confirmationEmailResponse = await resend.emails.send({
      from: "RentFair Support <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message!",
      html: `
        <h2>Thank you for contacting RentFair Support</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p><strong>Your message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          <strong>Subject:</strong> ${subject}<br><br>
          <strong>Message:</strong><br>
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p>Best regards,<br>The RentFair Support Team</p>
        <hr>
        <p style="color: #666; font-size: 12px;">If you have any urgent issues, please call us at +91 6205791382</p>
      `,
    });

    console.log("Support email sent successfully:", supportEmailResponse);
    console.log("Confirmation email sent successfully:", confirmationEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      supportEmail: supportEmailResponse,
      confirmationEmail: confirmationEmailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-support-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
