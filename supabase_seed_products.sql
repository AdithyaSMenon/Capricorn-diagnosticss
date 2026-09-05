-- =============================================
-- Capricorn Diagnostics — Seed Products SQL
-- Run this in your Supabase SQL Editor after running supabase_schema.sql
-- =============================================

INSERT INTO products (name, brand_id, category_id, description, brochure_url, image_url)
VALUES
  -- 1. Roche Diagnostics Products
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

  -- 2. J. Mitra & Co. Products
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

  -- 3. Reckon Diagnostics Products
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
  ),

  -- 4. Human Diagnostics Products
  (
    'HumaCount 5D Hematology Analyzer',
    (SELECT id FROM brands WHERE name = 'Human' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Hematology' LIMIT 1),
    '5-part differential hematology system with 3D laser scatter technology for precise cell differentiation.',
    'https://www.human.de',
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80'
  ),

  -- 5. Medsource Ozone Products
  (
    'Ozone Blood Collection Tubes (EDTA K3 / Gel)',
    (SELECT id FROM brands WHERE name = 'Medsource Ozone Biomedicals Pvt. Ltd.' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Consumables' LIMIT 1),
    'Premium quality vacuum blood collection tubes ensuring accurate sample draw and plasma separation.',
    '',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  ),

  -- 6. On Call Plus
  (
    'On Call Plus Blood Glucose Meter & Test Strips',
    (SELECT id FROM brands WHERE name = 'On Call Plus' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Rapid Test Kits' LIMIT 1),
    'Accurate and affordable point-of-care blood glucose monitoring system for clinical and home diagnostics.',
    '',
    'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=600&q=80'
  )
ON CONFLICT DO NOTHING;
