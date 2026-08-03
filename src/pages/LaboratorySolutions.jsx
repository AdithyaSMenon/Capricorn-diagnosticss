import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import '../styles/pages.css';

const ANALYZERS = [
  {
    id:    'immunology',
    label: 'Immunology',
    title: 'Immunology Analyzers',
    desc:  'Advanced immunoassay analyzers for accurate quantitative and qualitative detection of hormones, infectious disease markers, tumour markers, cardiac markers and more. Suitable for laboratories of all sizes.',
    features: ['Chemiluminescence & ELISA platforms','High-throughput automation','Wide test menus','Integrated QC management'],
  },
  {
    id:    'chemistry',
    label: 'Clinical Chemistry',
    title: 'Clinical Chemistry Analyzers',
    desc:  'Reliable clinical chemistry analyzers for routine and specialty testing including liver function, kidney function, lipid profiles, glucose, electrolytes and more. Compact benchtop to high-volume systems available.',
    features: ['Photometric & ISE methodology','Open-channel reagent compatibility','Bi-directional LIS connectivity','On-board reagent calibration'],
  },
  {
    id:    'hematology',
    label: 'Hematology',
    title: 'Hematology Analyzers',
    desc:  'Precision hematology analyzers providing complete blood count (CBC), differential cell counts, reticulocyte analysis and coagulation testing. Designed for speed, accuracy and ease of use.',
    features: ['3-part & 5-part differential','Automated flagging & morphology','High-speed processing','Minimal sample volume'],
  },
  {
    id:    'pathology',
    label: 'Pathology',
    title: 'Pathology & Lab Diagnostic Systems',
    desc:  'Comprehensive pathology and laboratory diagnostic systems for histology, cytology, urinalysis and microbiology applications. Supporting clinical laboratories with complete diagnostic workflows.',
    features: ['Urine chemistry & microscopy','Microbiology culture systems','Histopathology support','Specimen management integration'],
  },
];

const SUPPORT_ITEMS = [
  { icon: '🔍', title: 'Instrument Selection' },
  { icon: '⚙️', title: 'Installation Coordination' },
  { icon: '🛠️', title: 'Technical Support' },
  { icon: '📚', title: 'Application Support' },
  { icon: '🔧', title: 'After-Sales Service' },
];

export default function LaboratorySolutions() {
  return (
    <Layout>
      {/* Hero */}
      <section className="solutions-hero">
        <div className="container">
          <span className="section-label" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>Solutions</span>
          <h1>Laboratory Solutions</h1>
          <p>Comprehensive analyzer sales, installation and support across Kerala</p>
        </div>
      </section>

      {/* Intro */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          <span className="section-label">Our Approach</span>
          <h2>Beyond Supply — Complete Laboratory Support</h2>
          <p style={{ fontSize: '1.0625rem', marginTop: '0.75rem' }}>
            Capricorn Diagnostics assists healthcare institutions with end-to-end laboratory setup
            and analyzer support — from selecting the right instrument to providing ongoing technical
            and application support after installation.
          </p>
        </div>
      </section>

      {/* Analyzer Sections */}
      <div className="container">
        {ANALYZERS.map((a, i) => (
          <div key={a.id} className={`solution-feature${i % 2 !== 0 ? ' reverse' : ''}`}>
            <div className="sol-img-placeholder">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>{a.title} Image</span>
            </div>
            <div className="solution-content">
              <span className="section-label">{a.label}</span>
              <h2>{a.title}</h2>
              <p>{a.desc}</p>
              <div className="solution-features-list">
                {a.features.map((f, fi) => (
                  <div key={fi} className="sol-feature-item">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Support Services */}
      <section className="section support-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Support</span>
            <h2>How We Support You</h2>
            <p>Our commitment doesn't end at delivery. We provide comprehensive support at every stage.</p>
          </div>
          <div className="support-grid">
            {SUPPORT_ITEMS.map((s, i) => (
              <div key={i} className="support-card">
                <div className="support-card-icon">{s.icon}</div>
                <h4>{s.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '0.75rem' }}>Need a Laboratory Analyzer?</h2>
          <p style={{ maxWidth: 500, margin: '0 auto 1.75rem' }}>
            Contact us to discuss your laboratory's analyzer requirements and we'll help you find the right solution.
          </p>
          <Link to="/contact" className="btn btn-primary">Get In Touch</Link>
        </div>
      </section>
    </Layout>
  );
}
