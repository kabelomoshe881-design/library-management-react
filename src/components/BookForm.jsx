// src/components/BookForm.jsx
import { useState, useEffect } from 'react';

const BookForm = ({ editingBook, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    quantity: 1,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // When user clicks "Update", fill the form
  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        genre: editingBook.genre,
        isbn: editingBook.isbn,
        quantity: editingBook.quantity,
      });
    } else {
      setFormData({
        title: '',
        author: '',
        genre: '',
        isbn: '',
        quantity: 1,
      });
    }
    setError('');
    setSuccess('');
  }, [editingBook]);

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
    if (!formData.title.trim() || !formData.author.trim() || !formData.genre || !formData.isbn.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (Number(formData.quantity) < 0) {
      setError('Quantity cannot be negative');
      return;
    }

    // Call parent function (add or update)
    const result = onSuccess(formData);

    if (result.success) {
      setSuccess(editingBook ? 'Book updated successfully!' : 'Book added successfully!');
      if (!editingBook) {
        // Reset form only when adding
        setFormData({
          title: '',
          author: '',
          genre: '',
          isbn: '',
          quantity: 1,
        });
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>{editingBook ? '✏️ Update Book' : '➕ Add New Book'}</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Book title"
            />
          </div>

          <div className="form-group">
            <label>Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Genre *</label>
              <select name="genre" value={formData.genre} onChange={handleChange}>
                <option value="">Select Genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="History">History</option>
                <option value="Biography">Biography</option>
                <option value="Children">Children</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>ISBN *</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="ISBN number"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingBook ? 'Update Book' : 'Add Book'}
            </button>
            {editingBook && (
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

export default BookForm;
