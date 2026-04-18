import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pricingAPI, categoryAPI } from '../../services/api';
import './Admin.css';
import './AdminTable.css';
import './AdminForm.css';

export default function AdminPricing() {
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [globalPct, setGlobalPct] = useState('');
  const [globalLabel, setGlobalLabel] = useState('');
  const [catId, setCatId] = useState('');
  const [catPct, setCatPct] = useState('');
  const [catLabel, setCatLabel] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError('');
    try {
      const [o, c] = await Promise.all([
        pricingAPI.list(),
        categoryAPI.getAll(),
      ]);
      setOffers(o.data.offers || []);
      setCategories(c.data.categories || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pricing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleGlobalSave = async (e) => {
    e.preventDefault();
    const pct = Number(globalPct);
    if (Number.isNaN(pct) || pct < 0 || pct > 100) {
      setError('Store-wide discount must be between 0 and 100');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await pricingAPI.setGlobal({ discount_percent: pct, label: globalLabel || null });
      setGlobalPct('');
      setGlobalLabel('');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleCategorySave = async (e) => {
    e.preventDefault();
    const cid = parseInt(catId, 10);
    const pct = Number(catPct);
    if (!cid) {
      setError('Select a category');
      return;
    }
    if (Number.isNaN(pct) || pct < 0 || pct > 100) {
      setError('Discount must be between 0 and 100');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await pricingAPI.setCategory({
        category_id: cid,
        discount_percent: pct,
        label: catLabel || null,
      });
      setCatPct('');
      setCatLabel('');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (id) => {
    if (!window.confirm('Deactivate this offer?')) return;
    try {
      await pricingAPI.deactivate(id);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <div className="loading">Loading pricing…</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Pricing &amp; offers</h1>
        <p>Set a percentage off for all products, or override per category.</p>
        <Link to="/admin" className="admin-back">← Dashboard</Link>
      </div>

      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="admin-pricing-grid">
          <section className="admin-form-card">
            <h2>Store-wide offer</h2>
            <p className="form-hint">Applies to every product unless a category has its own active offer.</p>
            <form onSubmit={handleGlobalSave} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={globalPct}
                    onChange={(e) => setGlobalPct(e.target.value)}
                    placeholder="e.g. 10"
                    required
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Label (optional)</label>
                  <input
                    type="text"
                    value={globalLabel}
                    onChange={(e) => setGlobalLabel(e.target.value)}
                    placeholder="Festive sale"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Apply store-wide'}
              </button>
            </form>
          </section>

          <section className="admin-form-card">
            <h2>Category offer</h2>
            <p className="form-hint">Overrides the store-wide % for products in that category.</p>
            <form onSubmit={handleCategorySave} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={catId} onChange={(e) => setCatId(e.target.value)} required>
                    <option value="">Select…</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={catPct}
                    onChange={(e) => setCatPct(e.target.value)}
                    placeholder="e.g. 15"
                    required
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Label (optional)</label>
                  <input
                    type="text"
                    value={catLabel}
                    onChange={(e) => setCatLabel(e.target.value)}
                    placeholder="Baby week"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Apply to category'}
              </button>
            </form>
          </section>
        </div>

        <h2 className="admin-section-title">Offer history</h2>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Scope</th>
                <th>Category</th>
                <th>%</th>
                <th>Label</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {offers.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-cell">
                    No offers yet. Create a store-wide or category offer above.
                  </td>
                </tr>
              )}
              {offers.map((o) => (
                <tr key={o.id} className={o.is_active ? '' : 'row-inactive'}>
                  <td>{o.scope === 'all' ? 'All products' : 'Category'}</td>
                  <td>{o.scope === 'category' ? o.category_name || `#${o.category_id}` : '—'}</td>
                  <td>{Number(o.discount_percent).toFixed(2)}%</td>
                  <td>{o.label || '—'}</td>
                  <td>{o.is_active ? 'Yes' : 'No'}</td>
                  <td>
                    {o.is_active && (
                      <button type="button" className="btn btn-small btn-outline" onClick={() => deactivate(o.id)}>
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
