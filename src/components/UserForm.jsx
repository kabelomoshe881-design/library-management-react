// src/components/UserForm.jsx
import { useState, useEffect } from 'react';

const UserForm = ({ editingUser, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    membershipId: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fill form when editing
  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        membershipId: editingUser.membershipId,
        password: '', // leave blank when editing
        role: editingUser.role,
      });
    } else {
      setFormData({
        name: '',
        membershipId: '',
        password: '',
        role: '',
      });
    }
    setError('');
    setSuccess('');
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name.trim() || !formData.membershipId.trim() || !formData.role) {
      setError('Please fill in all required fields');
      return;
    }

    // Password is required only when adding a new user
    if (!editingUser && !formData.password) {
      setError('Password is required for new users');
      return;
    }

    const result = onSuccess(formData);

    if (result.success) {
      setSuccess(editingUser ? 'User updated successfully!' : 'User added successfully!');
      if (!editingUser) {
        setFormData({
          name: '',
          membershipId: '',
          password: '',
          role: '',
        });
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>{editingUser ? '✏️ Update User' : '➕ Add New User'}</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
            />
          </div>

          <div className="form-group">
            <label>Membership ID *</label>
            <input
              type="text"
              name="membershipId"
              value={formData.membershipId}
              onChange={handleChange}
              placeholder="e.g. LIB001"
            />
          </div>

          <div className="form-group">
            <label>
              Password {editingUser ? '(leave blank to keep current)' : '*'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={editingUser ? 'Leave blank to keep current' : 'Set password'}
            />
          </div>

          <div className="form-group">
            <label>Role *</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="">Select role</option>
              <option value="admin">Admin / Librarian</option>
              <option value="member">Member</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingUser ? 'Update User' : 'Add User'}
            </button>
            {editingUser && (
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
