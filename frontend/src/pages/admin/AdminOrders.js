import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import './AdminTable.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

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

        <div className="table-wrap">
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
              {orders.map(order => {
                const items = Array.isArray(order.items) ? order.items.filter(Boolean) : [];
                const isOpen = expandedId === order.id;
                return (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td>
                        #{order.id}
                        {order.order_channel === 'whatsapp' && (
                          <div><small>WhatsApp</small></div>
                        )}
                      </td>
                      <td>
                        <div>{order.user_name || 'Guest'}</div>
                        {order.user_phone && <small>{order.user_phone}</small>}
                        {order.user_email && <div><small>{order.user_email}</small></div>}
                        {order.delivery_city && <div><small>{order.delivery_city}</small></div>}
                      </td>
                      <td>{items.length} item{items.length !== 1 ? 's' : ''}</td>
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
                        <button
                          type="button"
                          className="btn-small btn-edit"
                          onClick={() => setExpandedId(isOpen ? null : order.id)}
                        >
                          {isOpen ? 'Hide' : 'View'}
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="admin-order-detail-row">
                        <td colSpan={7}>
                          <div className="admin-order-detail">
                            <p>
                              <strong>Address:</strong>{' '}
                              {order.delivery_street || order.delivery_address?.address || '—'}
                              {order.delivery_city ? `, ${order.delivery_city}` : ''}
                            </p>
                            {order.delivery_address?.mapLink && (
                              <p>
                                <strong>Map:</strong>{' '}
                                <a href={order.delivery_address.mapLink} target="_blank" rel="noreferrer">
                                  Open location
                                </a>
                              </p>
                            )}
                            <p>
                              <strong>Rental:</strong>{' '}
                              {order.start_date || '—'}
                              {order.end_date ? ` → ${order.end_date}` : ''}
                              {order.tenure_months > 0 ? ` (${order.tenure_months} mo)` : ''}
                            </p>
                            {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                            <ul>
                              {items.map((item, idx) => (
                                <li key={idx}>
                                  {item.product_name} × {item.quantity} — ₹{parseFloat(item.unit_price).toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

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
