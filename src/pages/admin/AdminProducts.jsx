import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { uploadProductFile } from '../../lib/storage';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EMPTY_PRODUCT = { name: '', brand_id: '', category_id: '', description: '', brochure_url: '', image_url: '' };

// Fallback data used when Supabase is not yet connected
const DEMO_CATEGORIES = [
  { id: 'cat-1',  name: 'Clinical Chemistry' },
  { id: 'cat-2',  name: 'Immunology' },
  { id: 'cat-3',  name: 'Hematology' },
  { id: 'cat-4',  name: 'Rapid Test Kits' },
  { id: 'cat-5',  name: 'Blood Bank' },
  { id: 'cat-6',  name: 'Microbiology' },
  { id: 'cat-7',  name: 'Molecular Diagnostics' },
  { id: 'cat-8',  name: 'Laboratory Instruments' },
  { id: 'cat-9',  name: 'Consumables' },
  { id: 'cat-10', name: 'Reagents' },
  { id: 'cat-11', name: 'Accessories' },
];

const DEMO_BRANDS = [
  { id: 'br-1',  name: 'Roche Diagnostics' },
  { id: 'br-2',  name: 'J. Mitra & Co. Pvt. Ltd.' },
  { id: 'br-3',  name: 'Reckon Diagnostics' },
  { id: 'br-4',  name: 'Human' },
  { id: 'br-5',  name: 'Medsource Ozone Biomedicals Pvt. Ltd.' },
  { id: 'br-6',  name: 'Hindustan Latex Limited' },
  { id: 'br-7',  name: 'Biolab' },
  { id: 'br-8',  name: 'Lilac Medicare' },
  { id: 'br-9',  name: 'Peerless Biotech' },
  { id: 'br-10', name: 'On Call Plus' },
  { id: 'br-11', name: 'Labtech Medico' },
  { id: 'br-12', name: 'Heme Diamed' },
  { id: 'br-13', name: 'LabX' },
];

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
  const [products,     setProducts]     = useState([]);
  const [brands,       setBrands]       = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [modal,        setModal]        = useState(null); // null | 'add' | 'edit'
  const [form,         setForm]         = useState(EMPTY_PRODUCT);
  const [imageFile,    setImageFile]    = useState(null);
  const [brochureFile, setBrochureFile] = useState(null);
  const [uploading,    setUploading]    = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [errorMsg,     setErrorMsg]     = useState('');
  const [search,       setSearch]       = useState('');

  const LS_KEY = 'capricorn_local_products';

  const loadFromLocalStorage = (brandsData, catsData) => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const stored = raw ? JSON.parse(raw) : [];
      // Enrich with brand/category names for display
      return stored.map(p => ({
        ...p,
        brands:     { name: brandsData.find(b => b.id === p.brand_id)?.name    || '' },
        categories: { name: catsData.find(c  => c.id === p.category_id)?.name  || '' },
      }));
    } catch { return []; }
  };

  const saveToLocalStorage = (list) => {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  };

  const load = async () => {
    if (!isSupabaseConfigured) {
      // Demo / offline mode — use hardcoded lists + localStorage products
      const enriched = loadFromLocalStorage(DEMO_BRANDS, DEMO_CATEGORIES);
      setProducts(enriched);
      setBrands(DEMO_BRANDS);
      setCategories(DEMO_CATEGORIES);
      setLoading(false);
      return;
    }
    const [p, b, c] = await Promise.all([
      supabase.from('products').select('*, brands(name), categories(name)').order('name'),
      supabase.from('brands').select('id,name').order('name'),
      supabase.from('categories').select('id,name').order('sort_order'),
    ]);
    setProducts(p.data || []);
    setBrands(b.data && b.data.length > 0 ? b.data : DEMO_BRANDS);
    setCategories(c.data && c.data.length > 0 ? c.data : DEMO_CATEGORIES);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm(EMPTY_PRODUCT);
    setImageFile(null);
    setBrochureFile(null);
    setErrorMsg('');
    setModal('add');
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      brand_id: p.brand_id || '',
      category_id: p.category_id || '',
      description: p.description || '',
      brochure_url: p.brochure_url || '',
      image_url: p.image_url || '',
      _id: p.id
    });
    setImageFile(null);
    setBrochureFile(null);
    setErrorMsg('');
    setModal('edit');
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    let finalImageUrl = form.image_url;
    let finalBrochureUrl = form.brochure_url;

    // Handle file uploads (uses object URL in offline mode)
    try {
      if (imageFile) {
        setUploading(true);
        finalImageUrl = isSupabaseConfigured
          ? await uploadProductFile(imageFile, 'product-images')
          : URL.createObjectURL(imageFile);
      }
      if (brochureFile) {
        setUploading(true);
        finalBrochureUrl = isSupabaseConfigured
          ? await uploadProductFile(brochureFile, 'product-brochures')
          : URL.createObjectURL(brochureFile);
      }
    } catch (err) {
      setErrorMsg(`Upload failed: ${err.message}`);
      setSaving(false);
      setUploading(false);
      return;
    }
    setUploading(false);

    const payload = {
      name: form.name,
      brand_id: form.brand_id || null,
      category_id: form.category_id || null,
      description: form.description,
      brochure_url: finalBrochureUrl,
      image_url: finalImageUrl,
    };

    if (!isSupabaseConfigured) {
      // --- Offline / localStorage mode ---
      const raw = localStorage.getItem(LS_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      if (modal === 'add') {
        const newProduct = { ...payload, id: `local-${Date.now()}` };
        saveToLocalStorage([...existing, newProduct]);
      } else {
        saveToLocalStorage(existing.map(p => p.id === form._id ? { ...p, ...payload } : p));
      }
      setSaving(false);
      setModal(null);
      load();
      return;
    }

    // --- Supabase mode ---
    if (modal === 'add') {
      const { error } = await supabase.from('products').insert([payload]);
      if (error) { setErrorMsg(`Failed to add product: ${error.message}`); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('products').update(payload).eq('id', form._id);
      if (error) { setErrorMsg(`Failed to update product: ${error.message}`); setSaving(false); return; }
    }
    setSaving(false);
    setModal(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    if (!isSupabaseConfigured) {
      const raw = localStorage.getItem(LS_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      saveToLocalStorage(existing.filter(p => p.id !== id));
      load();
      return;
    }
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
              <tr><th>Image</th><th>Name</th><th>Brand</th><th>Category</th><th>Brochure</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: 6, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>📷</div>
                    )}
                  </td>
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
              {errorMsg && (
                <div style={{ background: '#fef2f2', color: 'var(--error)', padding: '0.625rem 0.875rem', borderRadius: 6, fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {errorMsg}
                </div>
              )}

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
                <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short product description (2–4 lines)" />
              </div>

              {/* Product Image File / URL */}
              <div className="form-group">
                <label>Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  style={{ marginBottom: '0.5rem' }}
                  onChange={e => setImageFile(e.target.files[0] || null)}
                />
                <input
                  type="text"
                  className="form-control"
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="Or paste image URL (https://...)"
                />
                {(imageFile || form.image_url) && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Preview:</span>
                    <img
                      src={imageFile ? URL.createObjectURL(imageFile) : form.image_url}
                      alt="Preview"
                      style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                    />
                  </div>
                )}
              </div>

              {/* Brochure File / URL */}
              <div className="form-group">
                <label>Brochure PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  className="form-control"
                  style={{ marginBottom: '0.5rem' }}
                  onChange={e => setBrochureFile(e.target.files[0] || null)}
                />
                <input
                  type="text"
                  className="form-control"
                  value={form.brochure_url}
                  onChange={e => setForm(f => ({ ...f, brochure_url: e.target.value }))}
                  placeholder="Or paste brochure PDF URL (https://...)"
                />
                {brochureFile && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.25rem', display: 'block' }}>
                    Selected file: {brochureFile.name}
                  </span>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving || uploading}>
                {uploading ? 'Uploading Files...' : saving ? 'Saving Product...' : 'Save Product'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
