-- =============================================
-- Capricorn Diagnostics — Supabase Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brands
CREATE TABLE IF NOT EXISTS brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  brochure_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company Info (key-value store)
CREATE TABLE IF NOT EXISTS company_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stats
CREATE TABLE IF NOT EXISTS stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  hospital_lab_name TEXT,
  company TEXT,
  phone TEXT,
  email TEXT,
  product_of_interest TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Public can read everything except enquiries
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read company_info" ON company_info FOR SELECT USING (true);
CREATE POLICY "Public read stats" ON stats FOR SELECT USING (true);

-- Public can insert enquiries
CREATE POLICY "Public insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- Authenticated (admin) can do everything
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all brands" ON brands FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all company_info" ON company_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all stats" ON stats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read enquiries" ON enquiries FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- Seed default stats
-- =============================================
INSERT INTO stats (label, value, sort_order) VALUES
  ('Years of Experience', '28+', 1),
  ('Trusted Brands', '12+', 2),
  ('Products', '1000+', 3),
  ('Healthcare Customers', '500+', 4)
ON CONFLICT DO NOTHING;

-- Seed default company info
INSERT INTO company_info (key, value) VALUES
  ('about_story', 'Capricorn Diagnostics was founded on 14th October 1998 by Arunkumar V with a vision to provide healthcare institutions with reliable, high-quality diagnostic products and exceptional service. What began as a dedicated diagnostic distribution business has grown into one of the trusted names in the diagnostic industry across Kerala.'),
  ('mission', 'Provide accurate, reliable and high-quality diagnostic solutions that contribute to better healthcare.'),
  ('vision', 'To remain one of Kerala''s most trusted diagnostic distribution companies while continuously expanding our partnerships and product portfolio.'),
  ('phone', '+91 XXXXX XXXXX'),
  ('email', 'info@capricorndiagnostics.com'),
  ('address', 'Kerala, India'),
  ('office_hours', 'Monday – Saturday: 9:00 AM – 6:00 PM'),
  ('facebook_url', ''),
  ('linkedin_url', ''),
  ('instagram_url', ''),
  ('whatsapp_number', '')
ON CONFLICT (key) DO NOTHING;

-- Seed default brands
INSERT INTO brands (name, description) VALUES
  ('Roche Diagnostics', 'Global leader in in-vitro diagnostics and pioneering personalised healthcare.'),
  ('J. Mitra & Co. Pvt. Ltd.', 'Renowned Indian manufacturer of rapid diagnostic kits and immunoassay reagents.'),
  ('Reckon Diagnostics', 'Trusted provider of clinical chemistry and immunoassay diagnostic solutions.'),
  ('Human', 'International manufacturer of diagnostic reagents and controls for clinical laboratories.'),
  ('Medsource Ozone Biomedicals Pvt. Ltd.', 'India-based manufacturer specialising in blood bank and haematology products.'),
  ('Hindustan Latex Limited', 'Leading Indian public sector enterprise manufacturing latex-based medical products.'),
  ('Biolab', 'Specialist in laboratory reagents and analytical biochemistry solutions.'),
  ('Lilac Medicare', 'Provider of quality diagnostic kits and laboratory consumables.'),
  ('Peerless Biotech', 'Manufacturer of immunoassay and molecular diagnostic products.'),
  ('On Call Plus', 'Trusted brand for point-of-care rapid diagnostic testing solutions.'),
  ('Labtech Medico', 'Supplier of laboratory instruments, reagents and diagnostic accessories.'),
  ('Heme Diamed', 'Specialist in blood bank diagnostics and haematology solutions.'),
  ('LabX', 'Provider of advanced laboratory instruments and consumables.')
ON CONFLICT DO NOTHING;

-- Seed default categories
INSERT INTO categories (name, sort_order) VALUES
  ('Clinical Chemistry', 1),
  ('Immunology', 2),
  ('Hematology', 3),
  ('Rapid Test Kits', 4),
  ('Blood Bank', 5),
  ('Microbiology', 6),
  ('Molecular Diagnostics', 7),
  ('Laboratory Instruments', 8),
  ('Consumables', 9),
  ('Reagents', 10),
  ('Accessories', 11)
ON CONFLICT DO NOTHING;
