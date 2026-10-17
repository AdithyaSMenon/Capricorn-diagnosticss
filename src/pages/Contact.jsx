import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Layout from '../components/layout/Layout';
import '../styles/pages.css';

const CONTACT_INFO = [
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: 'Address',
    value: 'TMC 36/6507, Joses Tower, North Bus Stand,\nChembukkavu P.O., Thrissur 680 020',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.9a16 16 0 0 0 5.97 5.97l.83-.83a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    title: 'Phone (Landline)',
    value: '0487 2332166 / 2323266',
    href: 'tel:04872332166',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    title: 'Mobile',
    value: '+91 83019 59266 / 94471 23266',
    href: 'tel:+918301959266',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    title: 'Email',
    value: 'capri.diagnostics@gmail.com',
    href: 'mailto:capri.diagnostics@gmail.com',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3h-8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/>
      </svg>
    ),
    title: 'GSTIN',
    value: '32AACFC9612N1ZE',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Office Hours',
    value: 'Monday – Saturday: 9:00 AM – 6:00 PM',
  },
];

const INITIAL_FORM = {
  name: '', hospital_lab_name: '', company: '',
  phone: '', email: '', product_of_interest: '', message: '',
};

export default function Contact() {
  const [form, setForm]           = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { error: err } = await supabase.from('enquiries').insert([form]);
      if (err) throw err;
      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch {
      setError('Something went wrong. Please try again or contact us by phone.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="contact-hero">
        <div className="container">
          <span className="section-label" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>Contact</span>
          <h1>Get In Touch</h1>
          <p>We're here to help with product enquiries, orders and support</p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="section">
        <div className="container">
          <div className="contact-grid">

            {/* Info */}
            <div className="contact-info">
              <div>
                <span className="section-label">Contact Information</span>
                <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>We'd Love to Hear From You</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                  Reach out for product enquiries, pricing, brochures or any support you need.
                </p>
              </div>
              {CONTACT_INFO.map((item, i) => (
                <div key={i} className="contact-info-card">
                  <div className="contact-info-icon">{item.icon}</div>
                  <div>
                    <h4>{item.title}</h4>
                    {item.href
                      ? <a href={item.href}>{item.value}</a>
                      : <p style={{ whiteSpace: 'pre-line' }}>{item.value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="contact-form-card">
              {submitted ? (
                <div className="submit-success">
                  <div className="submit-success-icon">
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3>Thank You!</h3>
                  <p>Our team will contact you shortly.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => setSubmitted(false)}>Send Another Enquiry</button>
                </div>
              ) : (
                <>
                  <h3>Send an Enquiry</h3>
                  {error && <div className="login-error">{error}</div>}
                  <form className="form-stack" onSubmit={handleSubmit} id="enquiry-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="c-name">Name *</label>
                        <input id="c-name" name="name" className="form-control" required value={form.name} onChange={handleChange} placeholder="Your full name" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="c-phone">Phone *</label>
                        <input id="c-phone" name="phone" className="form-control" required value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="c-email">Email</label>
                      <input id="c-email" name="email" type="email" className="form-control" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="c-hospital">Hospital / Lab Name</label>
                        <input id="c-hospital" name="hospital_lab_name" className="form-control" value={form.hospital_lab_name} onChange={handleChange} placeholder="Institution name" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="c-company">Company</label>
                        <input id="c-company" name="company" className="form-control" value={form.company} onChange={handleChange} placeholder="Company name" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="c-product">Product of Interest</label>
                      <input id="c-product" name="product_of_interest" className="form-control" value={form.product_of_interest} onChange={handleChange} placeholder="e.g. Hematology Analyzer, Rapid Test Kits" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="c-message">Message</label>
                      <textarea id="c-message" name="message" className="form-control" value={form.message} onChange={handleChange} placeholder="How can we help you?" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
                      {submitting ? 'Sending...' : 'Send Enquiry'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Google Maps Embed */}
          <div style={{ borderRadius: '1rem', overflow: 'hidden', marginTop: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--gray-200)' }}>
            <iframe
              title="Capricorn Diagnostics Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3927.0!2d76.2144!3d10.5276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7ef!2sChembukkavu%2C%20Thrissur%2C%20Kerala%20680020!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="400"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
