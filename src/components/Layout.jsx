// src/components/Layout.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import './Layout.css';

const Layout = ({ children, title }) => {
  const { currentUser, isAdmin, logout } = useLibrary();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo-icon">📚</span>
          <span className="logo-text">Library MS</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/books" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            📖 Book Management
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            🔄 Transactions
          </NavLink>
          {isAdmin && (
            <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              👥 User Management
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div>
              <div className="user-name">{currentUser?.name}</div>
              <div className="user-role">{currentUser?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-area">
        <header className="topbar">
          <h1 className="page-title">{title}</h1>
          <div className="topbar-date">
            {new Date().toLocaleDateString(undefined, {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
