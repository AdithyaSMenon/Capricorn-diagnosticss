import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import '../styles/products.css';

const CAT_ICONS = ['⚗️','🧬','🩸','🧪','🔬','🦠','🧫','🔭','📦','💊','🔧'];

function ProductCard({ product, brandName }) {
  return (
    <div className="product-card">
      <div className="product-img">
        {product.image_url
          ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <>
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>Product Image</span>
            </>
        }
      </div>
      <div className="product-body">
        <div className="product-brand">{brandName || 'Capricorn Diagnostics'}</div>
        <div className="product-name">{product.name}</div>
        {product.description && <p className="product-desc">{product.description}</p>}
        <div className="product-actions">
          {product.brochure_url
            ? <a href={product.brochure_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" download>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Brochure
              </a>
            : <button className="btn btn-ghost btn-sm" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Brochure
              </button>
          }
          <a href="/contact" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Enquire</a>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts]     = useState([]);
  const [brands, setBrands]         = useState({});
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');

  const selectedCat = searchParams.get('category') || '';

  useEffect(() => {
    Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('brands').select('id,name'),
    ]).then(([catRes, brandRes]) => {
      if (catRes.data) setCategories(catRes.data);
      if (brandRes.data) {
        const map = {};
        brandRes.data.forEach(b => { map[b.id] = b.name; });
        setBrands(map);
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from('products').select('*, categories(name)').order('name');
    if (selectedCat) query = query.eq('categories.name', selectedCat);

    query.then(({ data }) => {
      if (data) setProducts(data);
      setLoading(false);
    });
  }, [selectedCat]);

  const setCategory = (name) => {
    if (name) setSearchParams({ category: name });
    else setSearchParams({});
  };

  const filtered = products.filter(p => {
    const catMatch = !selectedCat || (p.categories && p.categories.name === selectedCat);
    const searchMatch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="products-hero">
        <div className="container">
          <span className="section-label" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>Products</span>
          <h1>Our Product Portfolio</h1>
          <p>Quality diagnostic products across all major laboratory specialties</p>
        </div>
      </section>

      {/* Toolbar */}
      <div className="products-toolbar">
        <div className="container">
          <div className="toolbar-inner">
            <div className="search-input-wrap">
              <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                id="product-search"
                className="form-control search-input"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          {/* Filter tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-tab${!selectedCat ? ' active' : ''}`}
              onClick={() => setCategory('')}
            >All Categories</button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-tab${selectedCat === cat.name ? ' active' : ''}`}
                onClick={() => setCategory(cat.name)}
              >{cat.name}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Overview (when no category selected and no search) */}
      {!selectedCat && !search && (
        <section className="section" style={{ background: 'var(--gray-50)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-label">Browse By</span>
              <h2>Product Categories</h2>
              <p>Click a category to view all products within that specialty.</p>
            </div>
            <div className="category-overview-grid">
              {(categories.length ? categories : []).map((cat, i) => (
                <div
                  key={cat.id}
                  className="cat-overview-card"
                  onClick={() => setCategory(cat.name)}
                >
                  <div className="cat-icon-lg">{CAT_ICONS[i % CAT_ICONS.length]}</div>
                  <h4>{cat.name}</h4>
                  <p>Click to browse</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      {(selectedCat || search) && (
        <section className="products-section">
          <div className="container">
            <div className="products-section-header">
              <h2>{selectedCat || 'Search Results'}</h2>
              <span className="products-count">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <h3>No products found</h3>
                <p>No products have been added to this category yet. Check back soon.</p>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} brandName={brands[p.brand_id]} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </Layout>
  );
}
