// src/utils/storage.js

const KEYS = {
  books: 'lms_books',
  users: 'lms_users',
  transactions: 'lms_transactions',
  session: 'lms_session',
};

// ---------- Generic helpers ----------
export const getItem = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

export const removeItem = (key) => {
  localStorage.removeItem(key);
};

// ---------- Books ----------
export const getBooks = () => getItem(KEYS.books) || [];
export const saveBooks = (books) => setItem(KEYS.books, books);

// ---------- Users ----------
export const getUsers = () => getItem(KEYS.users) || [];
export const saveUsers = (users) => setItem(KEYS.users, users);

// ---------- Transactions ----------
export const getTransactions = () => getItem(KEYS.transactions) || [];
export const saveTransactions = (transactions) => setItem(KEYS.transactions, transactions);

// ---------- Session (logged-in user) ----------
export const getSession = () => getItem(KEYS.session);
export const saveSession = (user) => setItem(KEYS.session, user);
export const clearSession = () => removeItem(KEYS.session);

// ---------- Seed default admin (runs only once) ----------
export const seedDefaultAdmin = () => {
  const users = getUsers();
  if (users.length === 0) {
    const defaultAdmin = {
      id: 'admin-001',
      name: 'System Administrator',
      membershipId: 'ADMIN001',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    saveUsers([defaultAdmin]);
    console.log('Default admin created: ADMIN001 / admin123');
  }
};

// Generate simple unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
};
