// src/pages/Users.jsx
import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import Layout from '../components/Layout';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';
import './Users.css';

const Users = () => {
  const { users, addUser, updateUser, deleteUser } = useLibrary();
  const [editingUser, setEditingUser] = useState(null);

  const handleFormSuccess = (formData) => {
    if (editingUser) {
      const result = updateUser(editingUser.id, formData);
      if (result.success) {
        setEditingUser(null);
      }
      return result;
    } else {
      return addUser(formData);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete user "${name}"? This cannot be undone.`)) {
      const result = deleteUser(id);
      if (!result.success) {
        alert(result.message);
      }
      if (editingUser?.id === id) {
        setEditingUser(null);
      }
    }
  };

  return (
    <Layout title="User Management">
      <div className="users-grid">
        <UserForm
          editingUser={editingUser}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
        <UserList
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </Layout>
  );
};

export default Users;
