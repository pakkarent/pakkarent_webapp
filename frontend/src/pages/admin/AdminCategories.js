import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../../services/api';
import { getParentCategories, getSubcategories } from '../../utils/categoryUtils';
import './Admin.css';
import './AdminForm.css';
import './AdminTable.css';

const EMPTY_FORM = {
  name: '',
  description: '',
  icon: '📦',
  sort_order: '0',
  parent_id: '',
  is_active: true,
};

function flattenForTable(categories) {
  const parents = getParentCategories(categories).sort(
    (a, b) => Number(a.sort_order) - Number(b.sort_order) || a.name.localeCompare(b.name)
  );
  const rows = [];
  for (const parent of parents) {
    rows.push({ ...parent, level: 0 });
    getSubcategories(categories, parent.id)
      .sort((a, b) => Number(a.sort_order) - Number(b.sort_order) || a.name.localeCompare(b.name))
      .forEach((sub) => rows.push({ ...sub, level: 1 }));
  }
  return rows;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const parentOptions = useMemo(() => getParentCategories(categories), [categories]);
  const tableRows = useMemo(() => flattenForTable(categories), [categories]);

  const load = async () => {
    setError('');
    try {
      const res = await categoryAPI.getAllAdmin();
      setCategories(res.data.categories || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = (asSubcategory = false, parentId = '') => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      parent_id: asSubcategory ? String(parentId) : '',
      sort_order: String(
        (asSubcategory
          ? getSubcategories(categories, parentId)
          : parentOptions
        ).reduce((max, c) => Math.max(max, Number(c.sort_order || 0)), 0) + 1
      ),
    });
    setShowForm(true);
    setError('');
  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name || '',
      description: cat.description || '',
      icon: cat.icon || '📦',
      sort_order: String(cat.sort_order ?? 0),
      parent_id: cat.parent_id ? String(cat.parent_id) : '',
      is_active: cat.is_active !== false,
    });
    setShowForm(true);
    setError('');
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setError('Name is required.');
      return;
    }

    const payload = {
      name,
      description: form.description.trim(),
      icon: form.icon.trim() || '📦',
      sort_order: parseInt(form.sort_order, 10) || 0,
      parent_id: form.parent_id ? parseInt(form.parent_id, 10) : null,
      image: '',
    };

    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await categoryAPI.update(editingId, { ...payload, is_active: form.is_active });
      } else {
        await categoryAPI.create(payload);
      }
      await load();
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (cat) => {
    const label = cat.parent_id ? 'subcategory' : 'category';
    if (!window.confirm(`Deactivate this ${label}? Products will keep their assignment but it won't show on the site.`)) {
      return;
    }
    try {
      await categoryAPI.delete(cat.id);
      await load();
      if (editingId === cat.id) closeForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate');
    }
  };

  const handleReactivate = async (cat) => {
    try {
      await categoryAPI.update(cat.id, {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        image: cat.image,
        sort_order: cat.sort_order,
        parent_id: cat.parent_id,
        is_active: true,
      });
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reactivate');
    }
  };

  if (loading) return <div className="loading">Loading categories…</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Categories</h1>
        <p>Add, edit and organise categories and subcategories</p>
        <Link to="/admin" className="admin-back">← Dashboard</Link>
      </div>

      <div className="container">
        {error && !showForm && <div className="alert alert-error">{error}</div>}

        <div className="admin-actions-bar">
          <div className="admin-cat-actions">
            <button type="button" className="btn btn-primary" onClick={() => openCreate(false)}>
              + Add category
            </button>
          </div>
          <p className="total-info">
            {parentOptions.length} categories · {categories.filter((c) => c.parent_id).length} subcategories
          </p>
        </div>

        {showForm && (
          <section className="admin-form-card admin-cat-form">
            <h2>{editingId ? 'Edit category' : form.parent_id ? 'New subcategory' : 'New category'}</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder={form.parent_id ? 'e.g. Cradle' : 'e.g. Event Rental'}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Icon</label>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                    placeholder="🎉"
                  />
                </div>
                <div className="form-group">
                  <label>Sort order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
                    min="0"
                  />
                </div>
              </div>
              {!editingId && (
                <div className="form-group">
                  <label>Parent category</label>
                  <select
                    value={form.parent_id}
                    onChange={(e) => setForm((f) => ({ ...f, parent_id: e.target.value }))}
                  >
                    <option value="">Top-level category</option>
                    {parentOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                    ))}
                  </select>
                  <p className="form-hint">Choose a parent to create a subcategory (e.g. Cradle under Event Rental).</p>
                </div>
              )}
              {editingId && form.parent_id && (
                <p className="form-hint">
                  Subcategory of:{' '}
                  <strong>{parentOptions.find((p) => String(p.id) === form.parent_id)?.name || `#${form.parent_id}`}</strong>
                </p>
              )}
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="2"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Short description for admin reference"
                />
              </div>
              {editingId && (
                <label className="checkbox admin-cat-active">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  />
                  Active (visible on site)
                </label>
              )}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create'}
                </button>
                <button type="button" className="btn btn-outline" onClick={closeForm}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <div className="table-wrap">
          <table className="admin-table admin-cat-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Sort</th>
                <th>Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-cell">No categories yet. Add one above.</td>
                </tr>
              )}
              {tableRows.map((cat) => (
                <tr key={cat.id} className={`${!cat.is_active ? 'row-inactive' : ''} cat-level-${cat.level}`}>
                  <td className="cat-name-cell">
                    <span className="cat-table-icon">{cat.icon || '📦'}</span>
                    <div>
                      <div className="cat-table-name">{cat.name}</div>
                      {cat.description && <small className="cat-table-desc">{cat.description}</small>}
                    </div>
                  </td>
                  <td>{cat.parent_id ? 'Subcategory' : 'Category'}</td>
                  <td>{cat.sort_order ?? 0}</td>
                  <td>{cat.product_count ?? 0}</td>
                  <td>{cat.is_active ? 'Active' : 'Inactive'}</td>
                  <td className="actions">
                    <button type="button" className="btn-small btn-edit" onClick={() => openEdit(cat)}>
                      Edit
                    </button>
                    {!cat.parent_id && cat.is_active && (
                      <button
                        type="button"
                        className="btn-small btn-outline"
                        onClick={() => openCreate(true, cat.id)}
                      >
                        + Sub
                      </button>
                    )}
                    {cat.is_active ? (
                      <button type="button" className="btn-small btn-delete" onClick={() => handleDeactivate(cat)}>
                        Deactivate
                      </button>
                    ) : (
                      <button type="button" className="btn-small btn-edit" onClick={() => handleReactivate(cat)}>
                        Activate
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
