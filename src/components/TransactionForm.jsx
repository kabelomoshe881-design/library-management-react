// src/components/TransactionForm.jsx
import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';

const TransactionForm = () => {
  const { books, recordTransaction } = useLibrary();

  const [formData, setFormData] = useState({
    bookId: '',
    type: '',
    quantity: 1,
    notes: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    if (!formData.bookId || !formData.type) {
      setError('Please select a book and transaction type');
      return;
    }

    if (Number(formData.quantity) < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    const result = recordTransaction(
      formData.bookId,
      formData.type,
      formData.quantity,
      formData.notes
    );

    if (result.success) {
      setSuccess(
        formData.type === 'add'
          ? 'Stock added successfully!'
          : 'Stock deducted successfully!'
      );
      // Reset form
      setFormData({
        bookId: '',
        type: '',
        quantity: 1,
        notes: '',
      });
    } else {
      setError(result.message);
    }
  };

  // Sort books alphabetically for the dropdown
  const sortedBooks = [...books].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="card">
      <div className="card-header">
        <h3>🔄 Stock Transaction</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Book *</label>
            <select
              name="bookId"
              value={formData.bookId}
              onChange={handleChange}
            >
              <option value="">Choose a book...</option>
              {sortedBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} (Stock: {book.quantity})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Transaction Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">Select type...</option>
              <option value="add">Add Stock (New Arrival)</option>
              <option value="deduct">Deduct Stock (Borrowed)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              placeholder="Optional notes..."
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="btn btn-primary btn-block">
            Record Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
