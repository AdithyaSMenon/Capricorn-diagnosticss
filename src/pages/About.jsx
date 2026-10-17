import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import logo from '../assets/logo.jpg';
import '../styles/about.css';

const COMMITMENT = [
  { title: 'Quality', desc: 'We uphold the highest standards in every product we distribute, ensuring diagnostic accuracy and reliability.' },
  { title: 'Reliability', desc: 'Healthcare providers can count on us for consistent, on-time delivery of critical diagnostic supplies.' },
  { title: 'Integrity', desc: 'We conduct our business with transparency, honesty and ethical practices at every step.' },
  { title: 'Customer Support', desc: 'Our responsive support team is always available to assist with product queries and after-sales service.' },
  { title: 'Technical Expertise', desc: 'Our team brings deep product knowledge and technical insight to help customers make informed choices.' },
  { title: 'Long-Term Partnerships', desc: 'We invest in long-term relationships with both our brand partners and our customers.' },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <span className="section-label" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>About Us</span>
          <h1>About Capricorn Diagnostics</h1>
          <p>Over 28 years of trusted diagnostic distribution across Kerala</p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <span className="section-label">Our Story</span>
              <h2>Founded on Trust, Built on Excellence</h2>
              <p>
                Capricorn Diagnostics was founded on 14th October 1998 by Arunkumar V with a vision
                to provide healthcare institutions with reliable, high-quality diagnostic products
                and exceptional service. What began as a dedicated diagnostic distribution business
                has grown into one of the trusted names in the diagnostic industry across Kerala.
              </p>
              <p>
                For over 28 years, Capricorn Diagnostics has been committed to supporting hospitals,
                clinical laboratories, blood banks, and healthcare professionals with dependable
                diagnostic solutions. Through consistent service, strong industry partnerships, and
                an unwavering focus on quality, we have earned the trust of numerous healthcare
                institutions across Kerala.
              </p>
              <p>
                Today, Capricorn Diagnostics offers a comprehensive portfolio of laboratory reagents,
                consumables, diagnostic kits and testing solutions. Our mission is to ensure accuracy,
                consistency, reliability and timely availability of quality diagnostic products that
                contribute to better patient care.
              </p>
            </div>
            <div className="story-image">
              <img
                src={logo}
                alt="Capricorn Diagnostics"
                style={{
                  width: '100%',
                  maxWidth: '320px',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-xl)',
                  background: 'white',
                  padding: '2rem',
                  boxShadow: '0 8px 32px rgba(26,86,219,0.12)',
                  border: '1px solid var(--gray-100)',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section mv-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Direction</span>
            <h2>Mission &amp; Vision</h2>
          </div>
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-card-icon mv-icon-primary">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
              <h3>Our Mission</h3>
              <p>
                Provide accurate, reliable and high-quality diagnostic solutions that contribute
                to better healthcare. We are committed to ensuring that every diagnostic product we
                deliver meets the highest standards of quality and reliability.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-card-icon mv-icon-teal">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <h3>Our Vision</h3>
              <p>
                To remain one of Kerala's most trusted diagnostic distribution companies while
                continuously expanding our partnerships and product portfolio to serve the
                evolving needs of healthcare institutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Values</span>
            <h2>Our Commitment</h2>
            <p>The principles that guide every decision we make and every service we deliver.</p>
          </div>
          <div className="commitment-grid">
            {COMMITMENT.map((item, i) => (
              <div key={i} className="commitment-card">
                <div className="commitment-num">{i + 1}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '0.75rem' }}>Work With Us</h2>
          <p style={{ maxWidth: 480, margin: '0 auto 1.75rem' }}>
            We are always open to new partnerships, product enquiries and customer relationships.
          </p>
          <Link to="/contact" className="btn btn-primary">Get In Touch</Link>
        </div>
      </section>
    </Layout>
  );
}
