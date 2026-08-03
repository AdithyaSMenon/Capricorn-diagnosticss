import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

const NAV = [
  {
    section: 'Main',
    links: [
      { to: '/admin', label: 'Dashboard', icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      ), end: true },
      { to: '/admin/products', label: 'Products', icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
      )},
      { to: '/admin/categories', label: 'Categories', icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      )},
      { to: '/admin/brands', label: 'Brands', icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
      )},
    ],
  },
  {
    section: 'Settings',
    links: [
      { to: '/admin/company', label: 'Company Info', icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 1.41 1.41M2.5 2.5l19 19M4.93 4.93a10 10 0 0 0-1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M19.07 4.93l-1.41 1.41"/></svg>
      )},
      { to: '/admin/enquiries', label: 'Enquiries', icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      )},
    ],
  },
];

export default function AdminLayout({ currentPage }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-logo">
          <div className="admin-logo-icon">CD</div>
          <span>
            Capricorn Diagnostics
            <small>Admin Panel</small>
          </span>
        </div>

        <nav className="admin-nav">
          {NAV.map(section => (
            <div key={section.section}>
              <div className="admin-nav-label">{section.section}</div>
              {section.links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink to="/" target="_blank" className="admin-nav-link" style={{ marginBottom: '0.25rem' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View Website
          </NavLink>
          <button onClick={handleLogout} className="admin-nav-link" style={{ color: '#f87171' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="hamburger"
              style={{ display: 'flex' }}
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Toggle sidebar"
            >
              <span/><span/><span/>
            </button>
            <h2>{currentPage || 'Dashboard'}</h2>
          </div>
          <div className="admin-user">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {user?.email}
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
