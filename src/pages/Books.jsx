// src/pages/Books.jsx
import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import Layout from '../components/Layout';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';
import './Books.css';

const Books = () => {
  const { books, addBook, updateBook, deleteBook } = useLibrary();
  const [editingBook, setEditingBook] = useState(null);

  const handleFormSuccess = (formData) => {
    if (editingBook) {
      const result = updateBook(editingBook.id, formData);
      if (result.success) {
        setEditingBook(null);
      }
      return result;
    } else {
      return addBook(formData);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    // Scroll to top of form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingBook(null);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteBook(id);
      if (editingBook?.id === id) {
        setEditingBook(null);
      }
    }
  };

  return (
    <Layout title="Book Management">
      <div className="books-grid">
        <BookForm
          editingBook={editingBook}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
        <BookList
          books={books}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </Layout>
  );
};

export default Books;
