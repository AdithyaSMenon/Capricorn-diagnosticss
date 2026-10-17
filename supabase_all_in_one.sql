-- ========================================================
-- Capricorn Diagnostics — All-in-One Supabase Setup
-- Copy and paste this ENTIRE file into the Supabase SQL Editor and click RUN.
-- ========================================================

-- 1. TABLES
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS company_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

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

-- 2. ROW LEVEL SECURITY (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Public can read data
DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read brands" ON brands;
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read company_info" ON company_info;
CREATE POLICY "Public read company_info" ON company_info FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read stats" ON stats;
CREATE POLICY "Public read stats" ON stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert enquiries" ON enquiries;
CREATE POLICY "Public insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- Admin / Authenticated full management
DROP POLICY IF EXISTS "Admin all categories" ON categories;
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all brands" ON brands;
CREATE POLICY "Admin all brands" ON brands FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all products" ON products;
CREATE POLICY "Admin all products" ON products FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all company_info" ON company_info;
CREATE POLICY "Admin all company_info" ON company_info FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all stats" ON stats;
CREATE POLICY "Admin all stats" ON stats FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin read enquiries" ON enquiries;
CREATE POLICY "Admin read enquiries" ON enquiries FOR SELECT USING (auth.role() = 'authenticated');

-- 3. STORAGE BUCKETS (FOR PRODUCT IMAGES & BROCHURES)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-brochures', 'product-brochures', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Product Images" ON storage.objects;
CREATE POLICY "Public Read Product Images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Read Product Brochures" ON storage.objects;
CREATE POLICY "Public Read Product Brochures" ON storage.objects FOR SELECT USING (bucket_id = 'product-brochures');

DROP POLICY IF EXISTS "Allow Upload Product Images" ON storage.objects;
CREATE POLICY "Allow Upload Product Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow Upload Product Brochures" ON storage.objects;
CREATE POLICY "Allow Upload Product Brochures" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-brochures');

DROP POLICY IF EXISTS "Allow Manage Product Images" ON storage.objects;
CREATE POLICY "Allow Manage Product Images" ON storage.objects FOR ALL USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow Manage Product Brochures" ON storage.objects;
CREATE POLICY "Allow Manage Product Brochures" ON storage.objects FOR ALL USING (bucket_id = 'product-brochures');

-- 4. SEED DATA

-- Stats
INSERT INTO stats (label, value, sort_order) VALUES
  ('Years of Experience', '28+', 1),
  ('Trusted Brands', '12+', 2),
  ('Products', '1000+', 3),
  ('Healthcare Customers', '500+', 4)
ON CONFLICT DO NOTHING;

-- Company Info
INSERT INTO company_info (key, value) VALUES
  ('about_story', 'Capricorn Diagnostics was founded on 14th October 1998 by Arunkumar V with a vision to provide healthcare institutions with reliable, high-quality diagnostic products and exceptional service. What began as a dedicated diagnostic distribution business has grown into one of the trusted names in the diagnostic industry across Kerala.'),
  ('mission', 'Provide accurate, reliable and high-quality diagnostic solutions that contribute to better healthcare.'),
  ('vision', 'To remain one of Kerala''s most trusted diagnostic distribution companies while continuously expanding our partnerships and product portfolio.'),
  ('phone', '0487 2332166, +91 83019 59266'),
  ('email', 'capri.diagnostics@gmail.com'),
  ('address', 'TMC 36/6507, Joses Tower, North Bus Stand, Chembukkavu P.O., Thrissur 680 020'),
  ('office_hours', 'Monday – Saturday: 9:00 AM – 6:00 PM'),
  ('gstin', '32AACFC9612N1ZE')
ON CONFLICT (key) DO NOTHING;

-- Brands
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

-- Categories
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

-- Products
INSERT INTO products (name, brand_id, category_id, description, brochure_url, image_url)
VALUES
  (
    'Cobas c 111 Analyzer',
    (SELECT id FROM brands WHERE name = 'Roche Diagnostics' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Clinical Chemistry' LIMIT 1),
    'Compact clinical chemistry analyzer designed for low-volume laboratories offering high precision, safety and ease of use.',
    'https://www.roche.com',
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80'
  ),
  (
    'Cobas e 411 Analyzer',
    (SELECT id FROM brands WHERE name = 'Roche Diagnostics' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Immunology' LIMIT 1),
    'Fully automated immunoassay analyzer for random access processing of ECLIA-based assays.',
    'https://www.roche.com',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'
  ),
  (
    'HIV TRI-DOT Rapid Test Kit',
    (SELECT id FROM brands WHERE name = 'J. Mitra & Co. Pvt. Ltd.' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Rapid Test Kits' LIMIT 1),
    'Visual, rapid, sensitive and qualitative immunoassay for the differential detection of antibodies to HIV-1 & HIV-2.',
    'https://jmitra.co.in',
    'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80'
  ),
  (
    'HCV TRI-DOT Rapid Test',
    (SELECT id FROM brands WHERE name = 'J. Mitra & Co. Pvt. Ltd.' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Rapid Test Kits' LIMIT 1),
    'Rapid diagnostic kit for qualitative detection of antibodies to Hepatitis C Virus in human serum or plasma.',
    'https://jmitra.co.in',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  ),
  (
    'HumaCount 5D Hematology Analyzer',
    (SELECT id FROM brands WHERE name = 'Human' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Hematology' LIMIT 1),
    '5-part differential hematology system with 3D laser scatter technology for precise cell differentiation.',
    'https://www.human.de',
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80'
  ),
  (
    'Reckon Chem-7 Semi-Automated Biochemistry Analyzer',
    (SELECT id FROM brands WHERE name = 'Reckon Diagnostics' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Laboratory Instruments' LIMIT 1),
    'Versatile semi-automated analyzer equipped with built-in thermal printer and wide wavelength selection.',
    '',
    'https://images.unsplash.com/photo-1583912267670-657592e914a6?auto=format&fit=crop&w=600&q=80'
  ),
  (
    'Glucose GOD-PAP Reagent Pack',
    (SELECT id FROM brands WHERE name = 'Reckon Diagnostics' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Reagents' LIMIT 1),
    'Enzymatic colorimetric reagent kit for quantitative determination of glucose in human serum or plasma.',
    '',
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80'
  );
