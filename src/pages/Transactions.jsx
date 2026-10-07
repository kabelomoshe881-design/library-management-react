// src/pages/Transactions.jsx
import Layout from '../components/Layout';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import './Transactions.css';

const Transactions = () => {
  return (
    <Layout title="Transactions">
      <div className="transactions-grid">
        <TransactionForm />
        <TransactionList />
      </div>
    </Layout>
  );
};

export default Transactions;
