import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { pricingAPI, categoryAPI } from '../../services/api';
import { isEventCategory, isMonthlyCategory } from '../../utils/productPricing';
import './Admin.css';
import './AdminTable.css';
import './AdminForm.css';

function OfferForm({ title, hint, categories, segment, saving, onSave }) {
  const [globalPct, setGlobalPct] = useState('');
  const [globalLabel, setGlobalLabel] = useState('');
  const [catId, setCatId] = useState('');
  const [catPct, setCatPct] = useState('');
  const [catLabel, setCatLabel] = useState('');
  const [localError, setLocalError] = useState('');

  const filteredCategories = useMemo(
    () => categories.filter((c) => (segment === 'monthly' ? isMonthlyCategory(c.id) : isEventCategory(c.id))),
    [categories, segment]
  );

  const handleGlobalSave = async (e) => {
    e.preventDefault();
    const pct = Number(globalPct);
    if (Number.isNaN(pct) || pct < 0 || pct > 100) {
      setLocalError('Discount must be between 0 and 100');
      return;
    }
    setLocalError('');
    await onSave({ type: 'global', discount_percent: pct, label: globalLabel || null, pricing_segment: segment });
    setGlobalPct('');
    setGlobalLabel('');
  };

  const handleCategorySave = async (e) => {
    e.preventDefault();
    const cid = parseInt(catId, 10);
    const pct = Number(catPct);
    if (!cid) {
      setLocalError('Select a category');
      return;
    }
    if (Number.isNaN(pct) || pct < 0 || pct > 100) {
      setLocalError('Discount must be between 0 and 100');
      return;
    }
    setLocalError('');
    await onSave({
      type: 'category',
      category_id: cid,
      discount_percent: pct,
      label: catLabel || null,
      pricing_segment: segment,
    });
    setCatPct('');
    setCatLabel('');
    setCatId('');
  };

  return (
    <section className="admin-form-card admin-pricing-segment">
      <h2>{title}</h2>
      <p className="form-hint">{hint}</p>
      {localError && <div className="alert alert-error">{localError}</div>}

      <form onSubmit={handleGlobalSave} className="admin-form admin-pricing-subform">
        <h3>Store-wide offer</h3>
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
              placeholder={segment === 'monthly' ? 'Appliance sale' : 'Wedding season'}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Apply store-wide'}
        </button>
      </form>

      <form onSubmit={handleCategorySave} className="admin-form admin-pricing-subform">
        <h3>Category offer</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select value={catId} onChange={(e) => setCatId(e.target.value)} required>
              <option value="">Select…</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
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
              placeholder={segment === 'monthly' ? 'Fridge week' : 'Baby week'}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Apply to category'}
        </button>
      </form>
    </section>
  );
}

export default function AdminPricing() {
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError('');
    try {
      const [o, c] = await Promise.all([pricingAPI.list(), categoryAPI.getAll()]);
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

  const handleSave = async (payload) => {
    setSaving(true);
    setError('');
    try {
      if (payload.type === 'global') {
        await pricingAPI.setGlobal({
          discount_percent: payload.discount_percent,
          label: payload.label,
          pricing_segment: payload.pricing_segment,
        });
      } else {
        await pricingAPI.setCategory({
          category_id: payload.category_id,
          discount_percent: payload.discount_percent,
          label: payload.label,
          pricing_segment: payload.pricing_segment,
        });
      }
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
      throw err;
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

  const segmentLabel = (seg) => (seg === 'event' ? 'Event / day' : 'Monthly');

  if (loading) return <div className="loading">Loading pricing…</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Pricing &amp; offers</h1>
        <p>Manage discounts separately for monthly appliances and event/day rentals.</p>
        <Link to="/admin" className="admin-back">← Dashboard</Link>
      </div>

      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="admin-pricing-stack">
          <OfferForm
            title="Monthly pricing"
            hint="Applies to Home Appliances (per-month rentals). Category offers override the monthly store-wide %."
            categories={categories}
            segment="monthly"
            saving={saving}
            onSave={handleSave}
          />
          <OfferForm
            title="Event pricing"
            hint="Applies to event, backdrop, birthday, camping and other per-event / per-day rentals."
            categories={categories}
            segment="event"
            saving={saving}
            onSave={handleSave}
          />
        </div>

        <h2 className="admin-section-title">Offer history</h2>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Segment</th>
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
                  <td colSpan={7} className="empty-cell">
                    No offers yet. Create a monthly or event offer above.
                  </td>
                </tr>
              )}
              {offers.map((o) => (
                <tr key={o.id} className={o.is_active ? '' : 'row-inactive'}>
                  <td>{segmentLabel(o.pricing_segment)}</td>
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
