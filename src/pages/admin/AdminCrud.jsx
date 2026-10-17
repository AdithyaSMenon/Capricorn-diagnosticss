import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadProductFile } from '../../lib/storage';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

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

function CRUDPage({ title, table, fields }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState({});
  const [saving,  setSaving]  = useState(false);

  const load = async () => {
    const { data } = await supabase.from(table).select('*').order(fields[0].key);
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const emptyForm = () => {
    const f = {};
    fields.forEach(field => { f[field.key] = ''; });
    return f;
  };

  const openAdd  = () => { setForm(emptyForm()); setModal('add'); };
  const openEdit = (item) => { setForm({ ...item }); setModal('edit'); };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    const payload = {};
    fields.forEach(f => { payload[f.key] = form[f.key] || (f.type === 'number' ? 0 : null); });
    if (modal === 'add') {
      await supabase.from(table).insert([payload]);
    } else {
      await supabase.from(table).update(payload).eq('id', form.id);
    }
    setSaving(false);
    setModal(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm(`Delete this ${title.slice(0, -1).toLowerCase()}?`)) return;
    await supabase.from(table).delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3>{title} ({items.length})</h3>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add {title.slice(0, -1)}</button>
        </div>

        {loading ? <LoadingSpinner /> : items.length === 0 ? (
          <p style={{ padding: '2rem', color: 'var(--gray-400)', textAlign: 'center' }}>No {title.toLowerCase()} yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {fields.map(f => <th key={f.key}>{f.label}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  {fields.map(f => <td key={f.key}>{item[f.key] || '—'}</td>)}
                  <td>
                    <div className="admin-table-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}>Edit</button>
                      <button className="btn btn-sm" style={{ background: '#fef2f2', color: 'var(--error)' }} onClick={() => handleDelete(item.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? `Add ${title.slice(0, -1)}` : `Edit ${title.slice(0, -1)}`} onClose={() => setModal(null)}>
          <form onSubmit={handleSave}>
            <div className="modal-body">
              {fields.map(f => (
                <div key={f.key} className="form-group">
                  <label>{f.label}{f.required ? ' *' : ''}</label>
                  {f.type === 'textarea' ? (
                    <textarea className="form-control" required={f.required} rows={3} value={form[f.key] || ''} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                  ) : (
                    <input className="form-control" type={f.type || 'text'} required={f.required} value={form[f.key] || ''} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                  )}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export function AdminCategories() {
  return (
    <CRUDPage
      title="Categories"
      table="categories"
      fields={[
        { key: 'name', label: 'Category Name', required: true, placeholder: 'e.g. Immunology' },
        { key: 'sort_order', label: 'Sort Order', type: 'number', placeholder: '1' },
      ]}
    />
  );
}

export function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'add' | 'edit'
  const [form, setForm] = useState({ name: '', description: '', logo_url: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const load = async () => {
    const { data } = await supabase.from('brands').select('*').order('name');
    setBrands(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ name: '', description: '', logo_url: '' });
    setLogoFile(null);
    setPreviewUrl('');
    setErrorMsg('');
    setModal('add');
  };

  const openEdit = (b) => {
    setForm({ id: b.id, name: b.name, description: b.description || '', logo_url: b.logo_url || '' });
    setLogoFile(null);
    setPreviewUrl(b.logo_url || '');
    setErrorMsg('');
    setModal('edit');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    let finalLogoUrl = form.logo_url;

    if (logoFile) {
      try {
        setUploading(true);
        finalLogoUrl = await uploadProductFile(logoFile, 'product-images');
      } catch (err) {
        setErrorMsg(`Failed to upload logo: ${err.message}`);
        setSaving(false);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const payload = {
      name: form.name,
      description: form.description || null,
      logo_url: finalLogoUrl || null,
    };

    if (modal === 'add') {
      const { error } = await supabase.from('brands').insert([payload]);
      if (error) { setErrorMsg(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('brands').update(payload).eq('id', form.id);
      if (error) { setErrorMsg(error.message); setSaving(false); return; }
    }

    setSaving(false);
    setModal(null);
    load();
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete brand "${name}"?`)) return;
    await supabase.from('brands').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3>Brand Partners ({brands.length})</h3>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Brand</button>
        </div>

        {loading ? <LoadingSpinner /> : brands.length === 0 ? (
          <p style={{ padding: '2rem', color: 'var(--gray-400)', textAlign: 'center' }}>No brands yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Logo</th>
                <th>Brand Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(b => (
                <tr key={b.id}>
                  <td>
                    {b.logo_url ? (
                      <img src={b.logo_url} alt={b.name} style={{ width: 44, height: 44, objectFit: 'contain', background: '#fff', borderRadius: 4, border: '1px solid var(--gray-200)', padding: 2 }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: 4, background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', color: 'var(--gray-400)' }}>No Logo</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{b.name}</td>
                  <td style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{b.description || '—'}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(b)}>Edit</button>
                      <button className="btn btn-sm" style={{ background: '#fef2f2', color: 'var(--error)' }} onClick={() => handleDelete(b.id, b.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Brand Partner' : `Edit ${form.name}`} onClose={() => setModal(null)}>
          <form onSubmit={handleSave}>
            <div className="modal-body">
              {errorMsg && <div className="login-error" style={{ marginBottom: '1rem' }}>{errorMsg}</div>}
              
              <div className="form-group">
                <label>Brand Name *</label>
                <input className="form-control" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Roche Diagnostics" />
              </div>

              <div className="form-group">
                <label>Brand Logo Photo</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Logo preview" style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 6, border: '1px solid var(--gray-200)', background: '#fff', padding: 4 }} />
                  ) : (
                    <div style={{ width: 64, height: 64, borderRadius: 6, background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--gray-400)', border: '1px dashed var(--gray-300)' }}>Preview</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
                    <small style={{ color: 'var(--gray-400)', fontSize: '0.75rem', display: 'block', marginTop: 4 }}>PNG, JPG, SVG or WEBP</small>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Or Paste Logo Image URL</label>
                <input className="form-control" value={form.logo_url} onChange={e => { setForm(f => ({ ...f, logo_url: e.target.value })); if (!logoFile) setPreviewUrl(e.target.value); }} placeholder="https://example.com/logo.png" />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description of products or company" />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving || uploading}>
                {uploading ? 'Uploading Photo...' : saving ? 'Saving...' : 'Save Brand'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('enquiries').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setEnquiries(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="admin-table-wrap">
      <div className="admin-table-header">
        <h3>Enquiries ({enquiries.length})</h3>
      </div>
      {loading ? <LoadingSpinner /> : enquiries.length === 0 ? (
        <p style={{ padding: '2rem', color: 'var(--gray-400)', textAlign: 'center' }}>No enquiries yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Date</th><th>Name</th><th>Hospital/Lab</th><th>Phone</th><th>Email</th><th>Product Interest</th><th>Message</th></tr>
            </thead>
            <tbody>
              {enquiries.map(e => (
                <tr key={e.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(e.created_at).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600 }}>{e.name}</td>
                  <td>{e.hospital_lab_name || '—'}</td>
                  <td>{e.phone}</td>
                  <td>{e.email || '—'}</td>
                  <td>{e.product_of_interest || '—'}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.message || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
