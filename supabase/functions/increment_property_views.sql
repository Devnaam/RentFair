
CREATE OR REPLACE FUNCTION increment_property_views(property_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE property_listings 
  SET views_count = COALESCE(views_count, 0) + 1,
      updated_at = now()
  WHERE id = property_id;
END;
$$;
