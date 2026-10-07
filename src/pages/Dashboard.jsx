// src/pages/Dashboard.jsx
import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import Layout from '../components/Layout';
import './Dashboard.css';

const Dashboard = () => {
  const { books, users } = useLibrary();
  const [search, setSearch] = useState('');

  // Statistics
  const totalBooks = books.length;
  const totalStock = books.reduce((sum, b) => sum + b.quantity, 0);
  const lowStockCount = books.filter((b) => b.quantity < 2).length;
  const totalUsers = users.length;

  // Filtered books for the table
  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.genre.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (quantity) => {
    if (quantity === 0) return <span className="badge badge-danger">Out of Stock</span>;
    if (quantity < 2) return <span className="badge badge-warning">Low Stock</span>;
    return <span className="badge badge-success">Available</span>;
  };

  const getRowClass = (quantity) => {
    if (quantity === 0) return 'row-out-of-stock';
    if (quantity < 2) return 'row-low-stock';
    return '';
  };

  return (
    <Layout title="Dashboard">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📚</div>
          <div>
            <h3>{totalBooks}</h3>
            <p>Total Books</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📦</div>
          <div>
            <h3>{totalStock}</h3>
            <p>Total Stock</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">⚠️</div>
          <div>
            <h3>{lowStockCount}</h3>
            <p>Low Stock</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">👥</div>
          <div>
            <h3>{totalUsers}</h3>
            <p>Registered Users</p>
          </div>
        </div>
      </div>

      {/* Book Availability Table */}
      <div className="card">
        <div className="card-header">
          <h3>Book Availability</h3>
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
                    <th>Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className={getRowClass(book.quantity)}>
                      <td><strong>{book.title}</strong></td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>{book.isbn}</td>
                      <td><strong>{book.quantity}</strong></td>
                      <td>{getStatusBadge(book.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
