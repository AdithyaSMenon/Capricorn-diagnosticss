import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import '../styles/pages.css';

const FALLBACK_BRANDS = [
  { id: 1, name: 'Roche Diagnostics', description: 'Global leader in in-vitro diagnostics and pioneering personalised healthcare.' },
  { id: 2, name: 'J. Mitra & Co. Pvt. Ltd.', description: 'Renowned Indian manufacturer of rapid diagnostic kits and immunoassay reagents.' },
  { id: 3, name: 'Reckon Diagnostics', description: 'Trusted provider of clinical chemistry and immunoassay diagnostic solutions.' },
  { id: 4, name: 'Human', description: 'International manufacturer of diagnostic reagents and controls for clinical laboratories.' },
  { id: 5, name: 'Medsource Ozone Biomedicals Pvt. Ltd.', description: 'India-based manufacturer specialising in blood bank and haematology products.' },
  { id: 6, name: 'Hindustan Latex Limited', description: 'Leading Indian public sector enterprise manufacturing latex-based medical products.' },
  { id: 7, name: 'Biolab', description: 'Specialist in laboratory reagents and analytical biochemistry solutions.' },
  { id: 8, name: 'Lilac Medicare', description: 'Provider of quality diagnostic kits and laboratory consumables.' },
  { id: 9, name: 'Peerless Biotech', description: 'Manufacturer of immunoassay and molecular diagnostic products.' },
  { id: 10, name: 'On Call Plus', description: 'Trusted brand for point-of-care rapid diagnostic testing solutions.' },
  { id: 11, name: 'Labtech Medico', description: 'Supplier of laboratory instruments, reagents and diagnostic accessories.' },
  { id: 12, name: 'Heme Diamed', description: 'Specialist in blood bank diagnostics and haematology solutions.' },
  { id: 13, name: 'LabX', description: 'Provider of advanced laboratory instruments and consumables.' },
];

function BrandCard({ brand }) {
  return (
    <div className="brand-card-full">
      <div className="brand-logo-placeholder">
        {brand.logo_url
          ? <img src={brand.logo_url} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          : <span style={{ fontSize: '0.625rem', textAlign: 'center', color: 'var(--gray-400)' }}>Logo<br/>Placeholder</span>
        }
      </div>
      <div className="brand-info">
        <h3>{brand.name}</h3>
        <p>{brand.description || 'Authorized brand partner of Capricorn Diagnostics.'}</p>
      </div>
    </div>
  );
}

export default function BrandPartners() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.from('brands').select('*').order('name').then(({ data }) => {
      setBrands(data && data.length ? data : FALLBACK_BRANDS);
      setLoading(false);
    });
  }, []);

  const filtered = brands.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero */}
      <section className="brands-hero">
        <div className="container">
          <span className="section-label" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>Partners</span>
          <h1>Our Brand Partners</h1>
          <p>Authorized distributors for {brands.length}+ leading diagnostic brands</p>
        </div>
      </section>

      {/* Search */}
      <div className="brands-search-bar">
        <div className="container">
          <div style={{ position: 'relative', maxWidth: 480 }}>
            <svg style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}
              width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              id="brand-search"
              className="form-control"
              style={{ paddingLeft: '2.75rem', background: 'var(--gray-50)' }}
              type="text"
              placeholder="Search brand partners..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.375rem' }}>All Brand Partners</h2>
            <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{filtered.length} partner{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
            <div className="empty-state">
              <h3>No brands found</h3>
              <p>Try a different search term.</p>
            </div>
          ) : (
            <div className="brands-grid-full">
              {filtered.map(b => <BrandCard key={b.id} brand={b} />)}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
