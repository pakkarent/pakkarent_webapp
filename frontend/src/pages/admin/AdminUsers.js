import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './AdminTable.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminAPI.getUsers({ page, limit: 20 });
        setUsers(res.data.users);
        setTotal(res.data.total);
      } catch (err) {
        console.error('Error loading users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update role');
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Users</h1>
        <p>View and manage user accounts</p>
      </div>

      <div className="container">
        <div className="admin-actions-bar">
          <p></p>
          <p className="total-info">Total: {total} users</p>
        </div>

        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="product-name">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || '-'}</td>
                  <td>{user.city || '-'}</td>
                  <td>
                    <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)} className="role-select">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="actions">
                    <button className="btn-small btn-edit">View</button>
                  </td>
                </tr>
              ))}
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
