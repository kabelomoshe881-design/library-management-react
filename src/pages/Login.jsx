// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import './Login.css';

const Login = () => {
  const [membershipId, setMembershipId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useLibrary();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!membershipId.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    // Small delay just for better UX
    setTimeout(() => {
      const result = login(membershipId.trim(), password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">📚</div>
          <h1>Community Library</h1>
          <p>Library Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="membershipId">Membership ID</label>
            <input
              type="text"
              id="membershipId"
              value={membershipId}
              onChange={(e) => setMembershipId(e.target.value)}
              placeholder="Enter Membership ID"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-hint">
          Default Admin: <strong>ADMIN001</strong> / <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
};

export default Login;
