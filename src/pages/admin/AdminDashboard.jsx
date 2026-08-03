import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ products: 0, categories: 0, brands: 0, enquiries: 0 });
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('brands').select('*', { count: 'exact', head: true }),
      supabase.from('enquiries').select('*', { count: 'exact', head: true }),
      supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(5),
    ]).then(([p, c, b, e, recentE]) => {
      setCounts({
        products: p.count || 0,
        categories: c.count || 0,
        brands: b.count || 0,
        enquiries: e.count || 0,
      });
      if (recentE.data) setEnquiries(recentE.data);
      setLoading(false);
    });
  }, []);

  const STAT_CARDS = [
    { label: 'Products',    value: counts.products,    color: '#1a56db', bg: '#ebf0ff', icon: '📦' },
    { label: 'Categories',  value: counts.categories,  color: '#0d9488', bg: '#e6f7f6', icon: '🗂️' },
    { label: 'Brands',      value: counts.brands,      color: '#7c3aed', bg: '#ede9fe', icon: '🏷️' },
    { label: 'Enquiries',   value: counts.enquiries,   color: '#d97706', bg: '#fef3c7', icon: '💬' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.375rem', marginBottom: '0.25rem' }}>Welcome back</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Here's a quick overview of your website content.</p>
      </div>

      {/* Stat Cards */}
      <div className="admin-stat-cards">
        {STAT_CARDS.map((c, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-card-info">
              <h4 style={{ color: c.color }}>{c.value}</h4>
              <p>{c.label}</p>
            </div>
            <div className="admin-stat-card-icon" style={{ background: c.bg, color: c.color, fontSize: '1.5rem' }}>
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.0625rem', marginBottom: '0.875rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/products" className="btn btn-primary btn-sm">+ Add Product</Link>
          <Link to="/admin/categories" className="btn btn-outline btn-sm">+ Add Category</Link>
          <Link to="/admin/brands" className="btn btn-outline btn-sm">+ Add Brand</Link>
          <Link to="/admin/company" className="btn btn-ghost btn-sm">Edit Company Info</Link>
        </div>
      </div>

      {/* Recent Enquiries */}
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3>Recent Enquiries</h3>
          <Link to="/admin/enquiries" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        {enquiries.length === 0 ? (
          <p style={{ padding: '1.5rem', color: 'var(--gray-400)', fontSize: '0.875rem' }}>No enquiries yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Phone</th><th>Email</th><th>Product Interest</th><th>Date</th></tr>
            </thead>
            <tbody>
              {enquiries.map(e => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.phone}</td>
                  <td>{e.email || '—'}</td>
                  <td>{e.product_of_interest || '—'}</td>
                  <td>{new Date(e.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
