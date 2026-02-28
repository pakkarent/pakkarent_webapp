import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import './AdminTable.css';

const statusColors = {
  pending: '#FFC107',
  confirmed: '#2196F3',
  delivered: '#FF9800',
  active: '#4CAF50',
  completed: '#8BC34A',
  cancelled: '#f44336'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await orderAPI.getAll({ page, limit: 20, status: statusFilter || undefined });
        setOrders(res.data.orders);
        setTotal(res.data.total);
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Orders</h1>
        <p>View and update order statuses</p>
      </div>

      <div className="container">
        <div className="admin-actions-bar">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="status-filter">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="delivered">Delivered</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <p className="total-info">Total: {total} orders</p>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>
                  <div>{order.user_name}</div>
                  <small>{order.user_email}</small>
                </td>
                <td>{order.items ? order.items.length : 0} item{order.items && order.items.length > 1 ? 's' : ''}</td>
                <td>₹{parseFloat(order.total_amount).toFixed(2)}</td>
                <td>
                  <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className="status-select">
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="delivered">Delivered</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="actions">
                  <button className="btn-small btn-edit">View</button>
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
          </div>
        )}
      </div>
    </div>
  );
}

const StatusSelect = ({ value, options, onChange }) => (
  <select value={value} onChange={onChange} className="status-select">
    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
  </select>
);
