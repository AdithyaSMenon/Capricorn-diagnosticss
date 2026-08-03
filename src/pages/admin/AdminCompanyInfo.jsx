import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const FIELDS = [
  { key: 'about_story',    label: 'About Us / Company Story', type: 'textarea' },
  { key: 'mission',        label: 'Mission Statement', type: 'textarea' },
  { key: 'vision',         label: 'Vision Statement', type: 'textarea' },
  { key: 'phone',          label: 'Phone Number' },
  { key: 'email',          label: 'Email Address' },
  { key: 'address',        label: 'Address' },
  { key: 'office_hours',   label: 'Office Hours' },
  { key: 'whatsapp_number', label: 'WhatsApp Number' },
  { key: 'facebook_url',   label: 'Facebook URL' },
  { key: 'linkedin_url',   label: 'LinkedIn URL' },
  { key: 'instagram_url',  label: 'Instagram URL' },
];

const STAT_DEFAULTS = [
  { label: 'Years of Experience', value: '28+' },
  { label: 'Trusted Brands',      value: '12+' },
  { label: 'Products',            value: '1000+' },
  { label: 'Healthcare Customers', value: '500+' },
];

export default function AdminCompanyInfo() {
  const [info,    setInfo]    = useState({});
  const [stats,   setStats]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  const load = async () => {
    const [infoRes, statsRes] = await Promise.all([
      supabase.from('company_info').select('key,value'),
      supabase.from('stats').select('*').order('sort_order'),
    ]);
    if (infoRes.data) {
      const map = {};
      infoRes.data.forEach(r => { map[r.key] = r.value || ''; });
      setInfo(map);
    }
    if (statsRes.data && statsRes.data.length) setStats(statsRes.data);
    else setStats(STAT_DEFAULTS.map((s, i) => ({ ...s, sort_order: i + 1 })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSaveInfo = async e => {
    e.preventDefault();
    setSaving(true);
    const upserts = Object.entries(info).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
    await supabase.from('company_info').upsert(upserts, { onConflict: 'key' });

    // Save stats
    for (const s of stats) {
      if (s.id) {
        await supabase.from('stats').update({ label: s.label, value: s.value }).eq('id', s.id);
      } else {
        await supabase.from('stats').insert([{ label: s.label, value: s.value, sort_order: s.sort_order }]);
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Company Information</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Changes are saved to the database and appear live on the website.</p>
        </div>
        {saved && <span className="badge badge-teal">✓ Saved successfully</span>}
      </div>

      <form onSubmit={handleSaveInfo}>
        {/* General Info */}
        <div className="admin-table-wrap" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1.0625rem' }}>General Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FIELDS.map(f => (
              <div key={f.key} className="form-group">
                <label>{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    className="form-control"
                    rows={5}
                    value={info[f.key] || ''}
                    onChange={e => setInfo(v => ({ ...v, [f.key]: e.target.value }))}
                  />
                ) : (
                  <input
                    className="form-control"
                    value={info[f.key] || ''}
                    onChange={e => setInfo(v => ({ ...v, [f.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="admin-table-wrap" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1.0625rem' }}>Homepage Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Label</label>
                  <input className="form-control" value={s.label} onChange={e => setStats(v => v.map((x, xi) => xi === i ? { ...x, label: e.target.value } : x))} />
                </div>
                <div className="form-group" style={{ width: 100 }}>
                  <label>Value</label>
                  <input className="form-control" value={s.value} onChange={e => setStats(v => v.map((x, xi) => xi === i ? { ...x, value: e.target.value } : x))} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </form>
    </div>
  );
}
