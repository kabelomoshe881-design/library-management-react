// src/components/TransactionList.jsx
import { useLibrary } from '../context/LibraryContext';

const TransactionList = () => {
  const { transactions } = useLibrary();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>📜 Transaction History</h3>
      </div>
      <div className="card-body">
        {transactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions recorded yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Book</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{formatDate(t.date)}</td>
                    <td>{t.bookTitle}</td>
                    <td>
                      {t.type === 'add' ? (
                        <span className="badge badge-success">+ Add</span>
                      ) : (
                        <span className="badge badge-warning">− Deduct</span>
                      )}
                    </td>
                    <td>{t.quantity}</td>
                    <td>{t.performedBy}</td>
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

export default TransactionList;
