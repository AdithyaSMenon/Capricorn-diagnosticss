import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import '../styles/home.css';

const DEFAULT_STATS = [
  { label: 'Years of Experience', value: '28+' },
  { label: 'Trusted Brands',      value: '12+' },
  { label: 'Products',            value: '1000+' },
  { label: 'Healthcare Customers', value: '500+' },
];

const WHY_ITEMS = [
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 15l-2 5l9-11h-7l2-5l-9 11h7z"/>
      </svg>
    ),
    title: '28+ Years of Industry Experience'
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Trusted Across Kerala'
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: 'Authorized Diagnostic Brands'
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    ),
    title: 'Wide Product Portfolio'
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="1" y="3" width="15" height="13"/>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: 'Reliable Supply Chain'
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    title: 'Technical Product Support'
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: 'Ethical Business Practices'
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Prompt Delivery'
  },
];

const LAB_SOLUTIONS = [
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 3h6v3H9zM10 6v6.5L6.5 19a1 1 0 0 0 .8 1.5h9.4a1 1 0 0 0 .8-1.5L14 12.5V6"/>
      </svg>
    ),
    title: 'Immunology Analyzers'
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 3v18M3 12h18"/>
      </svg>
    ),
    title: 'Clinical Chemistry Analyzers'
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
      </svg>
    ),
    title: 'Hematology Analyzers'
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 18h12M12 2v12m-4-6l4-4 4 4"/>
        <circle cx="12" cy="18" r="3"/>
      </svg>
    ),
    title: 'Pathology & Lab Diagnostic Systems'
  },
];

const BRAND_NAMES = [
  'Roche Diagnostics','J. Mitra & Co.','Reckon Diagnostics','Human',
  'Medsource Ozone','Hindustan Latex','Biolab','Lilac Medicare',
  'Peerless Biotech','On Call Plus','Labtech Medico','Heme Diamed','LabX',
];

export default function Home() {
  const [stats, setStats]           = useState(DEFAULT_STATS);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from('stats').select('*').order('sort_order').then(({ data }) => {
      if (data && data.length) {
        setStats(data.map(s => ({ label: s.label, value: s.value })));
      }
    });
    supabase.from('categories').select('id,name').order('sort_order').then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-label">
                <span className="hero-label-dot" />
                Est. 1998 · Kerala's Trusted Diagnostic Partner
              </div>
              <h1>Capricorn<br/>Diagnostics</h1>
              <p className="hero-tagline">Your Partner in Better Diagnostics</p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-teal">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  Explore Products
                </Link>
                <Link to="/contact" className="btn btn-outline-white">Contact Us</Link>
              </div>
            </div>
            <div className="hero-image-wrap">
              <div className="hero-placeholder">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>Hero Image Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Company Intro ── */}
      <section className="section intro-section">
        <div className="container">
          <div className="intro-inner">
            <div className="intro-content">
              <div className="intro-badge">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                About Us
              </div>
              <h2>Delivering Reliable Diagnostic Solutions Since 1998</h2>
              <p>
                Capricorn Diagnostics has been delivering reliable diagnostic products and laboratory
                solutions since 1998. We partner with hospitals, laboratories, blood banks and
                healthcare professionals across Kerala by providing trusted diagnostic brands,
                quality products and dependable service.
              </p>
              <br />
              <Link to="/about" className="btn btn-outline btn-sm">Learn Our Story →</Link>
            </div>
            <div className="intro-visual">
              <div className="intro-img-placeholder">
                <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why Us</span>
            <h2>Why Choose Capricorn Diagnostics</h2>
            <p>We have built our reputation on trust, quality and service excellence for over two decades.</p>
          </div>
          <div className="why-grid">
            {WHY_ITEMS.map((item, i) => (
              <div key={i} className="why-card">
                <div className="why-icon">{item.icon}</div>
                <h4>{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Categories ── */}
      <section className="section categories-bg">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Products</span>
            <h2>Product Categories</h2>
            <p>Browse our comprehensive range of diagnostic products across multiple specialties.</p>
          </div>
          <div className="categories-grid">
            {(categories.length ? categories : [
              'Clinical Chemistry','Immunology','Hematology','Rapid Test Kits',
              'Blood Bank','Microbiology','Molecular Diagnostics','Laboratory Instruments',
              'Consumables','Reagents','Accessories',
            ].map((n, i) => ({ id: i, name: n }))).map(cat => (
              <div
                key={cat.id}
                className="category-card"
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
              >
                <div className="cat-icon">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Partners ── */}
      <section className="section brands-strip">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Partners</span>
            <h2>Our Brand Partners</h2>
            <p>We are proud to be authorized distributors for leading diagnostic brands.</p>
          </div>
          <div className="brands-grid-preview">
            {BRAND_NAMES.map((b, i) => (
              <div key={i} className="brand-chip">{b}</div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/brand-partners" className="btn btn-outline btn-sm">View All Partners →</Link>
          </div>
        </div>
      </section>

      {/* ── Lab Solutions ── */}
      <section className="section lab-solutions-preview">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Solutions</span>
            <h2>Laboratory Solutions</h2>
            <p>Comprehensive analyzer solutions for modern diagnostic laboratories.</p>
          </div>
          <div className="solutions-grid-preview">
            {LAB_SOLUTIONS.map((s, i) => (
              <div key={i} className="solution-card-sm">
                <div className="solution-icon-wrap">{s.icon}</div>
                <h4>{s.title}</h4>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/lab-solutions" className="btn btn-outline btn-sm">Explore Solutions →</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-inner">
            <span className="section-label" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>Get In Touch</span>
            <h2>Ready to Partner with Us?</h2>
            <p>
              Contact Capricorn Diagnostics today to explore our product portfolio, request pricing
              or discuss how we can support your laboratory.
            </p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-teal">Contact Us Today</Link>
              <Link to="/products" className="btn btn-outline-white">Browse Products</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
