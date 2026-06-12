import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../services/api';
import { getPricingType, pricingTypeLabel } from '../../utils/productPricing';
import { formatCategoryLabel, getParentCategories, getSubcategories } from '../../utils/categoryUtils';
import './AdminTable.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');

  const parentCategories = getParentCategories(categories);
  const subcategories = getSubcategories(categories, categoryId);

  useEffect(() => {
    categoryAPI.getAll().then((res) => setCategories(res.data.categories || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getAll({
          page,
          limit: 20,
          category_id: subcategoryId ? undefined : (categoryId || undefined),
          subcategory_id: subcategoryId || undefined,
          city: city || undefined,
          search: search.trim() || undefined,
        });
        setProducts(res.data.products);
        setTotal(res.data.total);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, categoryId, subcategoryId, city, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;
    try {
      await productAPI.delete(id);
      setProducts(products.filter((p) => p.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch {
      alert('Failed to delete product');
    }
  };

  const clearFilters = () => {
    setCategoryId('');
    setSubcategoryId('');
    setCity('');
    setSearch('');
    setPage(1);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Products</h1>
        <p>Filter by category to quickly find and edit products</p>
      </div>

      <div className="container">
        <div className="admin-actions-bar">
          <Link to="/admin/products/new" className="btn btn-primary">Add New Product</Link>
          <p className="total-info">{total} product{total !== 1 ? 's' : ''}</p>
        </div>

        <div className="admin-filter-bar">
          <label>
            Category
            <select
              className="status-filter"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubcategoryId('');
                setPage(1);
              }}
            >
              <option value="">All categories</option>
              {parentCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </label>
          {subcategories.length > 0 && (
            <label>
              Subcategory
              <select
                className="status-filter"
                value={subcategoryId}
                onChange={(e) => {
                  setSubcategoryId(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All subcategories</option>
                {subcategories.map((s) => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                ))}
              </select>
            </label>
          )}
          <label>
            City
            <select
              className="status-filter"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All cities</option>
              <option value="Chennai">Chennai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </label>
          <label className="admin-filter-search">
            Search
            <input
              type="search"
              className="status-filter"
              placeholder="Product name…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </label>
          {(categoryId || subcategoryId || city || search) && (
            <button type="button" className="btn btn-outline admin-filter-clear" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>City</th>
                  <th>Pricing</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr>
                    <td colSpan={8} className="empty-cell">No products match your filters.</td>
                  </tr>
                )}
                {products.map((prod) => {
                  const pricingType = getPricingType(prod);
                  return (
                    <tr key={prod.id}>
                      <td className="product-name">
                        <div>{prod.name}</div>
                        <small>ID: {prod.id}</small>
                      </td>
                      <td>{formatCategoryLabel(prod)}</td>
                      <td>{prod.city === 'all' ? 'All Cities' : prod.city}</td>
                      <td>
                        <span className={`pricing-badge pricing-badge-${pricingType}`}>
                          {pricingTypeLabel(pricingType)}
                        </span>
                      </td>
                      <td>₹{prod.monthly_price}</td>
                      <td>
                        <span className={`badge ${prod.stock > 5 ? 'badge-green' : 'badge-orange'}`}>
                          {prod.stock}
                        </span>
                      </td>
                      <td>{prod.is_featured ? '⭐ Yes' : 'No'}</td>
                      <td className="actions">
                        <Link to={`/admin/products/${prod.id}/edit`} className="btn-small btn-edit">Edit</Link>
                        <button className="btn-small btn-delete" type="button" onClick={() => handleDelete(prod.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button type="button" disabled={page === 1} onClick={() => setPage(1)}>First</button>
            <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} type="button" className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button type="button" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
            <button type="button" disabled={page === totalPages} onClick={() => setPage(totalPages)}>Last</button>
          </div>
        )}
      </div>
    </div>
  );
}
