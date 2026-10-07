// src/components/BookList.jsx
import { useState } from 'react';

const BookList = ({ books, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.genre.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase())
  );

  const getRowClass = (quantity) => {
    if (quantity === 0) return 'row-out-of-stock';
    if (quantity < 2) return 'row-low-stock';
    return '';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>📚 Book List</h3>
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="card-body">
        {filteredBooks.length === 0 ? (
          <div className="empty-state">
            <p>No books found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>ISBN</th>
                  <th>Qty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id} className={getRowClass(book.quantity)}>
                    <td><strong>{book.title}</strong></td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.isbn}</td>
                    <td>{book.quantity}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => onEdit(book)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(book.id, book.title)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;
