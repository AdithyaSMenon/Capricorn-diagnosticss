import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import '../../styles/navbar.css';

const navLinks = [
  { to: '/',                  label: 'Home' },
  { to: '/about',             label: 'About Us' },
  { to: '/products',          label: 'Products' },
  { to: '/brand-partners',    label: 'Brand Partners' },
  { to: '/lab-solutions',     label: 'Laboratory Solutions' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">

          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">CD</div>
            <div className="navbar-logo-text">
              <span className="brand-name">Capricorn Diagnostics</span>
              <span className="brand-tagline">Diagnostic Products Distributor</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="navbar-links">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              className={({ isActive }) => `nav-link navbar-cta${isActive ? ' active' : ''}`}
            >
              Contact Us
            </NavLink>
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="mobile-menu open">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `mobile-link${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className={({ isActive }) => `mobile-link${isActive ? ' active' : ''}`}
          >
            Contact Us
          </NavLink>
        </div>
      )}
    </>
  );
}
