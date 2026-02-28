import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';
import './AdminTable.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await productAPI.getAll({ page, limit: 20 });
        setProducts(res.data.products);
        setTotal(res.data.total);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;
    try {
      await productAPI.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Products</h1>
        <p>View and manage all rental products</p>
      </div>

      <div className="container">
        <div className="admin-actions-bar">
          <Link to="/admin/products/new" className="btn btn-primary">Add New Product</Link>
          <p className="total-info">Total: {total} products</p>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>City</th>
              <th>Monthly Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id}>
                <td className="product-name">
                  <div>{prod.name}</div>
                  <small>ID: {prod.id}</small>
                </td>
                <td>{prod.category_name}</td>
                <td>{prod.city === 'all' ? 'All Cities' : prod.city}</td>
                <td>₹{prod.monthly_price}</td>
                <td><span className={`badge ${prod.stock > 5 ? 'badge-green' : 'badge-orange'}`}>{prod.stock}</span></td>
                <td>{prod.is_featured ? '⭐ Yes' : 'No'}</td>
                <td className="actions">
                  <Link to={`/admin/products/${prod.id}/edit`} className="btn-small btn-edit">Edit</Link>
                  <button className="btn-small btn-delete" onClick={() => handleDelete(prod.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {Math.ceil(total / 20) > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(1)}>First</button>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            {Array.from({ length: Math.ceil(total / 20) }, (_, i) => i + 1).map(p => (
              <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button disabled={page === Math.ceil(total / 20)} onClick={() => setPage(page + 1)}>Next</button>
            <button disabled={page === Math.ceil(total / 20)} onClick={() => setPage(Math.ceil(total / 20))}>Last</button>
          </div>
        )}
      </div>
    </div>
  );
}
