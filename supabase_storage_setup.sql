-- =============================================
-- Capricorn Diagnostics — Supabase Storage Setup
-- Run this in your Supabase SQL Editor to enable image & brochure file uploads
-- =============================================

-- 1. Create Public Storage Buckets for Images and PDF Brochures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-brochures', 'product-brochures', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Security Policies

-- Public Read Access for Images and Brochures
CREATE POLICY "Public Read Product Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Public Read Product Brochures"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-brochures');

-- Allow Uploading Files
CREATE POLICY "Allow Upload Product Images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow Upload Product Brochures"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-brochures');

-- Allow Deleting/Updating Files
CREATE POLICY "Allow Manage Product Images"
  ON storage.objects FOR ALL
  USING (bucket_id = 'product-images');

CREATE POLICY "Allow Manage Product Brochures"
  ON storage.objects FOR ALL
  USING (bucket_id = 'product-brochures');
