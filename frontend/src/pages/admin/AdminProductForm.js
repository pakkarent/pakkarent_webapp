import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI, uploadAPI } from '../../services/api';
import './AdminForm.css';

const API_BASE = process.env.REACT_APP_API_URL || '';
const PLACEHOLDER_IMG = 'https://via.placeholder.com/320x220?text=PakkaRent';

function resolveImg(src) {
  if (!src) return null;
  const normalized = String(src).replace(/\\/g, '/');
  if (normalized.startsWith('http')) return normalized;
  if (normalized.startsWith('/')) return `${API_BASE}${normalized}`;
  return `${API_BASE}/${normalized}`;
}

function specsObjectToRows(specsValue) {
  let obj = specsValue;
  if (typeof specsValue === 'string') {
    try {
      obj = JSON.parse(specsValue || '{}');
    } catch {
      obj = {};
    }
  }
  if (!obj || Array.isArray(obj) || typeof obj !== 'object') return [{ key: '', value: '' }];
  const rows = Object.entries(obj).map(([k, v]) => ({ key: k, value: String(v) }));
  return rows.length ? rows : [{ key: '', value: '' }];
}

function rowsToSpecsObject(rows) {
  const result = {};
  for (const row of rows) {
    const key = (row.key || '').trim();
    const value = (row.value || '').trim();
    if (!key && !value) continue;
    if (!key || !value) {
      return { ok: false, error: 'Each spec row needs both key and value.' };
    }
    result[key] = value;
  }
  return { ok: true, value: result };
}

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [currentImages, setCurrentImages] = useState([]);
  const [manualImageUrls, setManualImageUrls] = useState('');
  const [specRows, setSpecRows] = useState([{ key: '', value: '' }]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: '📦' });
  const [categoryError, setCategoryError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    city: 'all',
    monthly_price: '',
    price_3month: '',
    price_6month: '',
    price_12month: '',
    security_deposit: '',
    stock: '10',
    is_featured: false,
    is_active: true
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const catRes = await categoryAPI.getAll();
        setCategories(catRes.data.categories);
        if (id) {
          const prodRes = await productAPI.getOne(id);
          const prod = prodRes.data.product;
          const imgs = Array.isArray(prod.images)
            ? prod.images
            : JSON.parse(prod.images || '[]');
          setCurrentImages(imgs);
          setFormData({
            name: prod.name,
            description: prod.description,
            category_id: String(prod.category_id),
            city: prod.city,
            monthly_price: prod.monthly_price,
            price_3month: prod.price_3month || '',
            price_6month: prod.price_6month || '',
            price_12month: prod.price_12month || '',
            security_deposit: prod.security_deposit,
            stock: prod.stock,
            is_featured: prod.is_featured,
            is_active: typeof prod.is_active === 'boolean' ? prod.is_active : true
          });
          setSpecRows(specsObjectToRows(prod.specs));
          setManualImageUrls('');
        }
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const parseNumber = (val) => {
    if (val === '' || val === null || val === undefined) return null;
    const n = Number(val);
    return Number.isFinite(n) ? n : null;
  };

  const parseManualUrls = () =>
    manualImageUrls
      .split('\n')
      .map(v => v.trim())
      .filter(Boolean);

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Product name is required.';
    if (!formData.category_id) nextErrors.category_id = 'Please choose a category.';

    const monthly = parseNumber(formData.monthly_price);
    const price3 = parseNumber(formData.price_3month);
    const price6 = parseNumber(formData.price_6month);
    const price12 = parseNumber(formData.price_12month);
    const deposit = parseNumber(formData.security_deposit) ?? 0;
    const stock = parseNumber(formData.stock);

    if (monthly === null || monthly <= 0) nextErrors.monthly_price = 'Monthly price must be greater than 0.';
    if (price3 !== null && price3 <= 0) nextErrors.price_3month = '3-month price must be greater than 0.';
    if (price6 !== null && price6 <= 0) nextErrors.price_6month = '6-month price must be greater than 0.';
    if (price12 !== null && price12 <= 0) nextErrors.price_12month = '12-month price must be greater than 0.';
    if (deposit < 0) nextErrors.security_deposit = 'Security deposit cannot be negative.';
    if (stock === null || stock < 0) nextErrors.stock = 'Stock must be 0 or more.';

    const specsResult = rowsToSpecsObject(specRows);
    if (!specsResult.ok) {
      nextErrors.specs = specsResult.error;
    }

    const urls = parseManualUrls();
    if (!id && urls.some(u => !/^https?:\/\/|^\/uploads\//i.test(u))) {
      nextErrors.manualImageUrls = 'Use one URL per line (http/https or /uploads/... path).';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) {
      setError('Please fix the highlighted fields and try again.');
      return;
    }

    setSaving(true);
    const initialImages = id ? currentImages : parseManualUrls();
    const parsedSpecs = rowsToSpecsObject(specRows);
    const submitData = {
      ...formData,
      monthly_price: parseFloat(formData.monthly_price),
      price_3month: formData.price_3month ? parseFloat(formData.price_3month) : null,
      price_6month: formData.price_6month ? parseFloat(formData.price_6month) : null,
      price_12month: formData.price_12month ? parseFloat(formData.price_12month) : null,
      security_deposit: parseFloat(formData.security_deposit) || 0,
      category_id: parseInt(formData.category_id),
      stock: parseInt(formData.stock),
      images: initialImages,
      specs: parsedSpecs.ok ? parsedSpecs.value : {}
    };
    try {
      if (id) {
        await productAPI.update(id, submitData);
      } else {
        await productAPI.create(submitData);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCategory = async () => {
    const name = newCategory.name.trim();
    if (!name) {
      setCategoryError('Category name is required.');
      return;
    }

    setCreatingCategory(true);
    setCategoryError('');
    try {
      const highestSort = categories.reduce((max, c) => Math.max(max, Number(c.sort_order || 0)), 0);
      const payload = {
        name,
        description: newCategory.description.trim(),
        icon: (newCategory.icon || '📦').trim(),
        image: '',
        sort_order: highestSort + 1
      };
      const res = await categoryAPI.create(payload);
      const created = res.data?.category;
      if (created) {
        const updated = [...categories, created].sort(
          (a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)
        );
        setCategories(updated);
        setFormData((prev) => ({ ...prev, category_id: String(created.id) }));
        setShowAddCategory(false);
        setNewCategory({ name: '', description: '', icon: '📦' });
      }
    } catch (err) {
      setCategoryError(err.response?.data?.message || 'Failed to create category.');
    } finally {
      setCreatingCategory(false);
    }
  };

  // Upload new images via API
  const handleFileUpload = async (e) => {
    if (!id) {
      setUploadError('Save the product first, then upload images.');
      return;
    }
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    setUploadError('');
    try {
      const res = await uploadAPI.uploadImages(id, files);
      setCurrentImages(res.data.images);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Remove an image
  const handleRemoveImage = async (imgPath) => {
    if (!id) {
      setCurrentImages(prev => prev.filter(i => i !== imgPath));
      return;
    }
    try {
      const res = await uploadAPI.removeImage(id, imgPath);
      setCurrentImages(res.data.images);
    } catch (err) {
      setUploadError('Failed to remove image');
    }
  };

  const handleSpecChange = (index, field, value) => {
    setSpecRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
    if (formErrors.specs) {
      setFormErrors((prev) => ({ ...prev, specs: '' }));
    }
  };

  const addSpecRow = () => {
    setSpecRows((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeSpecRow = (index) => {
    setSpecRows((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [{ key: '', value: '' }];
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>{id ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <div className="container">
        <form className="admin-form" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          {/* ── Basic Info ── */}
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label>Product Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              {formErrors.name && <p className="field-error">{formErrors.name}</p>}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                {formErrors.category_id && <p className="field-error">{formErrors.category_id}</p>}
                <div className="category-inline-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setShowAddCategory((v) => !v);
                      setCategoryError('');
                    }}
                  >
                    {showAddCategory ? 'Close' : '+ Add new category'}
                  </button>
                </div>
                {showAddCategory && (
                  <div className="category-create-box">
                    <input
                      type="text"
                      placeholder="Category name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    <input
                      type="text"
                      placeholder="Icon (optional, e.g. 🏕️)"
                      value={newCategory.icon}
                      onChange={(e) => setNewCategory((prev) => ({ ...prev, icon: e.target.value }))}
                    />
                    <textarea
                      rows="2"
                      placeholder="Description (optional)"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
                    />
                    {categoryError && <p className="field-error">{categoryError}</p>}
                    <div className="category-create-actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={creatingCategory}
                        onClick={handleCreateCategory}
                      >
                        {creatingCategory ? 'Creating...' : 'Create Category'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>City</label>
                <select name="city" value={formData.city} onChange={handleChange}>
                  <option value="all">All Cities</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Pricing ── */}
          <div className="form-section">
            <h2>Pricing</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Monthly Price *</label>
                <input type="number" name="monthly_price" value={formData.monthly_price} onChange={handleChange} required step="0.01" />
                {formErrors.monthly_price && <p className="field-error">{formErrors.monthly_price}</p>}
              </div>
              <div className="form-group">
                <label>3-Month Price</label>
                <input type="number" name="price_3month" value={formData.price_3month} onChange={handleChange} step="0.01" />
                {formErrors.price_3month && <p className="field-error">{formErrors.price_3month}</p>}
              </div>
              <div className="form-group">
                <label>6-Month Price</label>
                <input type="number" name="price_6month" value={formData.price_6month} onChange={handleChange} step="0.01" />
                {formErrors.price_6month && <p className="field-error">{formErrors.price_6month}</p>}
              </div>
              <div className="form-group">
                <label>12-Month Price</label>
                <input type="number" name="price_12month" value={formData.price_12month} onChange={handleChange} step="0.01" />
                {formErrors.price_12month && <p className="field-error">{formErrors.price_12month}</p>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Security Deposit</label>
                <input type="number" name="security_deposit" value={formData.security_deposit} onChange={handleChange} step="0.01" />
                {formErrors.security_deposit && <p className="field-error">{formErrors.security_deposit}</p>}
              </div>
              <div className="form-group">
                <label>Stock Quantity</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} />
                {formErrors.stock && <p className="field-error">{formErrors.stock}</p>}
              </div>
            </div>
          </div>

          {/* ── Images ── */}
          <div className="form-section">
            <h2>Product Images</h2>
            {uploadError && <div className="alert alert-error">{uploadError}</div>}

            {/* Current images grid */}
            {currentImages.length > 0 && (
              <div className="img-manager-grid">
                {currentImages.map((img, idx) => (
                  <div key={idx} className="img-manager-item">
                    <img
                      src={resolveImg(img) || PLACEHOLDER_IMG}
                      alt={`Product ${idx + 1}`}
                      onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
                    />
                    <button
                      type="button"
                      className="img-remove-btn"
                      onClick={() => handleRemoveImage(img)}
                      aria-label="Remove image"
                    >✕</button>
                    {idx === 0 && <span className="img-primary-badge">Primary</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <div className="img-upload-area">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handleFileUpload}
                disabled={uploading || !id}
                style={{ display: 'none' }}
                id="img-file-input"
              />
              <label
                htmlFor="img-file-input"
                className={`img-upload-label ${!id ? 'disabled' : ''}`}
              >
                {uploading ? '⏳ Uploading...' : '📷 Upload Images'}
              </label>
              {!id && (
                <>
                  <p className="img-upload-hint">Save the product first to enable file upload.</p>
                  <label className="manual-img-label">Optional: add image URLs now (one per line)</label>
                  <textarea
                    value={manualImageUrls}
                    onChange={(e) => setManualImageUrls(e.target.value)}
                    rows="4"
                    placeholder={"https://example.com/image1.jpg\n/uploads/products/camping/camping_tent/img_01.png"}
                  />
                  {formErrors.manualImageUrls && <p className="field-error">{formErrors.manualImageUrls}</p>}
                </>
              )}
              <p className="img-upload-hint">JPG, PNG, WebP — up to 10 MB each. First image is the primary display image.</p>
            </div>
          </div>

          {/* ── Details ── */}
          <div className="form-section">
            <h2>Details</h2>
            <div className="form-group">
              <label>Specifications</label>
              <div className="spec-rows">
                {specRows.map((row, idx) => (
                  <div className="spec-row" key={idx}>
                    <input
                      type="text"
                      placeholder="Key (e.g. Brand)"
                      value={row.key}
                      onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. Samsung)"
                      value={row.value}
                      onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-outline spec-remove-btn"
                      onClick={() => removeSpecRow(idx)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline spec-add-btn" onClick={addSpecRow}>
                  + Add spec row
                </button>
              </div>
              {formErrors.specs && <p className="field-error">{formErrors.specs}</p>}
            </div>
            <div className="form-group checkbox">
              <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} id="featured" />
              <label htmlFor="featured">Mark as Featured Product</label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Product'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/products')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
