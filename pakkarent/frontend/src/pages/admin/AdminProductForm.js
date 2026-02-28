import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../services/api';
import './AdminForm.css';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
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
    images: '[]',
    specs: '{}',
    stock: '10',
    is_featured: false
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const catRes = await categoryAPI.getAll();
        setCategories(catRes.data.categories);
        if (id) {
          const prodRes = await productAPI.getOne(id);
          const prod = prodRes.data.product;
          setFormData({
            name: prod.name,
            description: prod.description,
            category_id: prod.category_id,
            city: prod.city,
            monthly_price: prod.monthly_price,
            price_3month: prod.price_3month || '',
            price_6month: prod.price_6month || '',
            price_12month: prod.price_12month || '',
            security_deposit: prod.security_deposit,
            images: typeof prod.images === 'string' ? prod.images : JSON.stringify(prod.images),
            specs: typeof prod.specs === 'string' ? prod.specs : JSON.stringify(prod.specs),
            stock: prod.stock,
            is_featured: prod.is_featured
          });
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const submitData = {
      ...formData,
      monthly_price: parseFloat(formData.monthly_price),
      price_3month: formData.price_3month ? parseFloat(formData.price_3month) : null,
      price_6month: formData.price_6month ? parseFloat(formData.price_6month) : null,
      price_12month: formData.price_12month ? parseFloat(formData.price_12month) : null,
      security_deposit: parseFloat(formData.security_deposit),
      category_id: parseInt(formData.category_id),
      stock: parseInt(formData.stock),
      images: JSON.parse(formData.images),
      specs: JSON.parse(formData.specs)
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
    }
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

          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label>Product Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4"></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
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

          <div className="form-section">
            <h2>Pricing</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Monthly Price *</label>
                <input type="number" name="monthly_price" value={formData.monthly_price} onChange={handleChange} required step="0.01" />
              </div>

              <div className="form-group">
                <label>3-Month Price</label>
                <input type="number" name="price_3month" value={formData.price_3month} onChange={handleChange} step="0.01" />
              </div>

              <div className="form-group">
                <label>6-Month Price</label>
                <input type="number" name="price_6month" value={formData.price_6month} onChange={handleChange} step="0.01" />
              </div>

              <div className="form-group">
                <label>12-Month Price</label>
                <input type="number" name="price_12month" value={formData.price_12month} onChange={handleChange} step="0.01" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Security Deposit</label>
                <input type="number" name="security_deposit" value={formData.security_deposit} onChange={handleChange} step="0.01" />
              </div>

              <div className="form-group">
                <label>Stock Quantity</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Details</h2>

            <div className="form-group">
              <label>Images (JSON Array)</label>
              <textarea name="images" value={formData.images} onChange={handleChange} rows="3" placeholder='["https://example.com/image1.jpg"]'></textarea>
            </div>

            <div className="form-group">
              <label>Specifications (JSON Object)</label>
              <textarea name="specs" value={formData.specs} onChange={handleChange} rows="4" placeholder='{"Brand":"XYZ","Capacity":"10kg"}'></textarea>
            </div>

            <div className="form-group checkbox">
              <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} id="featured" />
              <label htmlFor="featured">Mark as Featured Product</label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Product</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/products')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
