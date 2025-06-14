
-- Create a table for inquiry replies
CREATE TABLE public.inquiry_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_id UUID REFERENCES public.property_inquiries(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('landlord', 'tenant')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure proper access control
ALTER TABLE public.inquiry_replies ENABLE ROW LEVEL SECURITY;

-- Create policy for landlords to view replies for their properties
CREATE POLICY "Landlords can view replies for their properties" 
  ON public.inquiry_replies 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.property_inquiries pi
      JOIN public.property_listings pl ON pi.listing_id = pl.id
      WHERE pi.id = inquiry_replies.inquiry_id
      AND pl.landlord_id = auth.uid()
    )
  );

-- Create policy for tenants to view replies for their inquiries
CREATE POLICY "Tenants can view replies for their inquiries" 
  ON public.inquiry_replies 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.property_inquiries pi
      WHERE pi.id = inquiry_replies.inquiry_id
      AND pi.tenant_id = auth.uid()
    )
  );

-- Create policy for landlords to insert replies for their properties
CREATE POLICY "Landlords can create replies for their properties" 
  ON public.inquiry_replies 
  FOR INSERT 
  WITH CHECK (
    sender_type = 'landlord' AND
    EXISTS (
      SELECT 1 FROM public.property_inquiries pi
      JOIN public.property_listings pl ON pi.listing_id = pl.id
      WHERE pi.id = inquiry_replies.inquiry_id
      AND pl.landlord_id = auth.uid()
    )
  );

-- Create policy for tenants to insert replies for their inquiries
CREATE POLICY "Tenants can create replies for their inquiries" 
  ON public.inquiry_replies 
  FOR INSERT 
  WITH CHECK (
    sender_type = 'tenant' AND
    EXISTS (
      SELECT 1 FROM public.property_inquiries pi
      WHERE pi.id = inquiry_replies.inquiry_id
      AND pi.tenant_id = auth.uid()
    )
  );

-- Create an index for better performance
CREATE INDEX idx_inquiry_replies_inquiry_id ON public.inquiry_replies(inquiry_id);
CREATE INDEX idx_inquiry_replies_created_at ON public.inquiry_replies(created_at);
