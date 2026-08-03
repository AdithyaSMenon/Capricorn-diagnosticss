import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
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
  return (
    <CRUDPage
      title="Brands"
      table="brands"
      fields={[
        { key: 'name', label: 'Brand Name', required: true, placeholder: 'e.g. Roche Diagnostics' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Short brand description' },
        { key: 'logo_url', label: 'Logo URL', placeholder: 'https://... (image URL)' },
      ]}
    />
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
