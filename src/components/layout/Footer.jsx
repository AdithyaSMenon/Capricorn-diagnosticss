import { Link } from 'react-router-dom';
import '../../styles/footer.css';

const quickLinks = [
  { to: '/',             label: 'Home' },
  { to: '/about',        label: 'About Us' },
  { to: '/products',     label: 'Products' },
  { to: '/brand-partners', label: 'Brand Partners' },
  { to: '/lab-solutions',  label: 'Laboratory Solutions' },
  { to: '/contact',        label: 'Contact Us' },
];

const categories = [
  'Clinical Chemistry', 'Immunology', 'Hematology',
  'Rapid Test Kits', 'Blood Bank', 'Microbiology',
  'Molecular Diagnostics', 'Laboratory Instruments',
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">CD</div>
              <div className="footer-logo-text">
                Capricorn Diagnostics
                <small>Diagnostic Products Distributor</small>
              </div>
            </div>
            <p className="footer-desc">
              Delivering reliable diagnostic products and laboratory solutions since 1998.
              Trusted by hospitals, laboratories and blood banks across Kerala.
            </p>
            <div className="footer-social">
              <a href="#" className="social-btn" aria-label="Facebook">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="social-btn" aria-label="LinkedIn">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="social-btn" aria-label="Instagram">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="social-btn" aria-label="WhatsApp">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <nav className="footer-links">
              {quickLinks.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}
            </nav>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Categories</h4>
            <nav className="footer-links">
              {categories.map(c => (
                <Link key={c} to={`/products?category=${encodeURIComponent(c)}`}>{c}</Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-contact-item">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Kerala, India</span>
            </div>
            <div className="footer-contact-item">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.9a16 16 0 0 0 5.97 5.97l.83-.83a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>+91 XXXXX XXXXX</span>
            </div>
            <div className="footer-contact-item">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>info@capricorndiagnostics.com</span>
            </div>
            <div className="footer-contact-item">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Mon–Sat: 9:00 AM – 6:00 PM</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Capricorn Diagnostics. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
