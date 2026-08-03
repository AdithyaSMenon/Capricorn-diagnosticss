import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EMPTY_PRODUCT = { name: '', brand_id: '', category_id: '', description: '', brochure_url: '', image_url: '' };

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [products,   setProducts]   = useState([]);
  const [brands,     setBrands]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null); // null | 'add' | 'edit'
  const [form,       setForm]       = useState(EMPTY_PRODUCT);
  const [saving,     setSaving]     = useState(false);
  const [search,     setSearch]     = useState('');

  const load = async () => {
    const [p, b, c] = await Promise.all([
      supabase.from('products').select('*, brands(name), categories(name)').order('name'),
      supabase.from('brands').select('id,name').order('name'),
      supabase.from('categories').select('id,name').order('sort_order'),
    ]);
    setProducts(p.data || []);
    setBrands(b.data || []);
    setCategories(c.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY_PRODUCT); setModal('add'); };
  const openEdit = (p)  => {
    setForm({ name: p.name, brand_id: p.brand_id || '', category_id: p.category_id || '', description: p.description || '', brochure_url: p.brochure_url || '', image_url: p.image_url || '', _id: p.id });
    setModal('edit');
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    const payload = { name: form.name, brand_id: form.brand_id || null, category_id: form.category_id || null, description: form.description, brochure_url: form.brochure_url, image_url: form.image_url };
    if (modal === 'add') {
      await supabase.from('products').insert([payload]);
    } else {
      await supabase.from('products').update(payload).eq('id', form._id);
    }
    setSaving(false);
    setModal(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3>Products ({products.length})</h3>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              className="form-control"
              style={{ maxWidth: 240 }}
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Product</button>
          </div>
        </div>

        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <p style={{ padding: '2rem', color: 'var(--gray-400)', textAlign: 'center' }}>No products yet. Click "+ Add Product" to get started.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Brand</th><th>Category</th><th>Brochure</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.brands?.name || '—'}</td>
                  <td>{p.categories?.name || '—'}</td>
                  <td>{p.brochure_url ? <a href={p.brochure_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontSize: '0.8125rem' }}>View PDF</a> : '—'}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-sm" style={{ background: '#fef2f2', color: 'var(--error)' }} onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Product' : 'Edit Product'} onClose={() => setModal(null)}>
          <form onSubmit={handleSave}>
            <div className="modal-body">
              <div className="form-group">
                <label>Product Name *</label>
                <input className="form-control" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product name" />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <select className="form-control" value={form.brand_id} onChange={e => setForm(f => ({ ...f, brand_id: e.target.value }))}>
                  <option value="">— Select Brand —</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-control" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                  <option value="">— Select Category —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short product description (2–4 lines)" />
              </div>
              <div className="form-group">
                <label>Brochure URL (PDF link)</label>
                <input className="form-control" value={form.brochure_url} onChange={e => setForm(f => ({ ...f, brochure_url: e.target.value }))} placeholder="https://... (PDF URL)" />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input className="form-control" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://... (image URL)" />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
