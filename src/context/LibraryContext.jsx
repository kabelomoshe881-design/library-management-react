// src/context/LibraryContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  getBooks,
  saveBooks,
  getUsers,
  saveUsers,
  getTransactions,
  saveTransactions,
  getSession,
  saveSession,
  clearSession,
  seedDefaultAdmin,
  generateId,
} from '../utils/storage';

const LibraryContext = createContext();

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider');
  }
  return context;
};

export const LibraryProvider = ({ children }) => {
  // ---------- State ----------
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------- Load data on first mount (lifecycle via useEffect) ----------
  useEffect(() => {
    seedDefaultAdmin();

    setBooks(getBooks());
    setUsers(getUsers());
    setTransactions(getTransactions());

    const session = getSession();
    if (session) {
      // Make sure the user still exists
      const stillExists = getUsers().find((u) => u.id === session.id);
      if (stillExists) {
        setCurrentUser(session);
      } else {
        clearSession();
      }
    }

    setLoading(false);
  }, []);

  // ---------- Persist books whenever they change ----------
  useEffect(() => {
    if (!loading) saveBooks(books);
  }, [books, loading]);

  // ---------- Persist users whenever they change ----------
  useEffect(() => {
    if (!loading) saveUsers(users);
  }, [users, loading]);

  // ---------- Persist transactions whenever they change ----------
  useEffect(() => {
    if (!loading) saveTransactions(transactions);
  }, [transactions, loading]);

  // ==================== AUTH ====================
  const login = (membershipId, password) => {
    const user = users.find(
      (u) =>
        u.membershipId.toLowerCase() === membershipId.toLowerCase() &&
        u.password === password
    );

    if (!user) {
      return { success: false, message: 'Invalid Membership ID or Password' };
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      membershipId: user.membershipId,
      role: user.role,
    };

    setCurrentUser(sessionUser);
    saveSession(sessionUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    clearSession();
  };

  const isAdmin = currentUser?.role === 'admin';

  // ==================== BOOKS ====================
  const addBook = (bookData) => {
    // Prevent duplicate ISBN
    if (books.some((b) => b.isbn.toLowerCase() === bookData.isbn.toLowerCase())) {
      return { success: false, message: 'A book with this ISBN already exists' };
    }

    const newBook = {
      id: generateId(),
      ...bookData,
      quantity: Number(bookData.quantity) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBooks((prev) => [...prev, newBook]);
    return { success: true };
  };

  const updateBook = (id, bookData) => {
    // Check ISBN uniqueness (exclude current book)
    if (
      books.some(
        (b) => b.id !== id && b.isbn.toLowerCase() === bookData.isbn.toLowerCase()
      )
    ) {
      return { success: false, message: 'Another book already uses this ISBN' };
    }

    setBooks((prev) =>
      prev.map((book) =>
        book.id === id
          ? {
              ...book,
              ...bookData,
              quantity: Number(bookData.quantity) || 0,
              updatedAt: new Date().toISOString(),
            }
          : book
      )
    );
    return { success: true };
  };

  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
    return { success: true };
  };

  // ==================== TRANSACTIONS ====================
  const recordTransaction = (bookId, type, quantity, notes = '') => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return { success: false, message: 'Book not found' };

    const qty = Number(quantity);
    if (isNaN(qty) || qty < 1) {
      return { success: false, message: 'Quantity must be at least 1' };
    }

    if (type === 'deduct' && book.quantity < qty) {
      return {
        success: false,
        message: `Insufficient stock. Only ${book.quantity} available`,
      };
    }

    // Update book quantity
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        return {
          ...b,
          quantity: type === 'add' ? b.quantity + qty : b.quantity - qty,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    // Add transaction record
    const newTransaction = {
      id: generateId(),
      bookId,
      bookTitle: book.title,
      type, // 'add' or 'deduct'
      quantity: qty,
      notes,
      performedBy: currentUser?.name || 'System',
      date: new Date().toISOString(),
    };

    setTransactions((prev) => [newTransaction, ...prev]); // newest first
    return { success: true };
  };

  // ==================== USERS ====================
  const addUser = (userData) => {
    if (
      users.some(
        (u) => u.membershipId.toLowerCase() === userData.membershipId.toLowerCase()
      )
    ) {
      return { success: false, message: 'Membership ID already exists' };
    }

    const newUser = {
      id: generateId(),
      name: userData.name.trim(),
      membershipId: userData.membershipId.trim().toUpperCase(),
      password: userData.password,
      role: userData.role,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    return { success: true };
  };

  const updateUser = (id, userData) => {
    // Prevent removing the last admin
    const targetUser = users.find((u) => u.id === id);
    if (
      targetUser?.role === 'admin' &&
      userData.role !== 'admin' &&
      users.filter((u) => u.role === 'admin').length <= 1
    ) {
      return { success: false, message: 'Cannot remove the last admin' };
    }

    if (
      users.some(
        (u) =>
          u.id !== id &&
          u.membershipId.toLowerCase() === userData.membershipId.toLowerCase()
      )
    ) {
      return { success: false, message: 'Membership ID already in use' };
    }

    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== id) return user;
        return {
          ...user,
          name: userData.name.trim(),
          membershipId: userData.membershipId.trim().toUpperCase(),
          role: userData.role,
          ...(userData.password ? { password: userData.password } : {}),
        };
      })
    );

    // Update session if the logged-in user was edited
    if (currentUser?.id === id) {
      const updatedSession = {
        ...currentUser,
        name: userData.name.trim(),
        membershipId: userData.membershipId.trim().toUpperCase(),
        role: userData.role,
      };
      setCurrentUser(updatedSession);
      saveSession(updatedSession);
    }

    return { success: true };
  };

  const deleteUser = (id) => {
    if (currentUser?.id === id) {
      return { success: false, message: 'You cannot delete your own account' };
    }

    const targetUser = users.find((u) => u.id === id);
    if (
      targetUser?.role === 'admin' &&
      users.filter((u) => u.role === 'admin').length <= 1
    ) {
      return { success: false, message: 'Cannot delete the last admin' };
    }

    setUsers((prev) => prev.filter((user) => user.id !== id));
    return { success: true };
  };

  // ---------- Value provided to the whole app ----------
  const value = {
    // State
    books,
    users,
    transactions,
    currentUser,
    loading,
    isAdmin,

    // Auth
    login,
    logout,

    // Books
    addBook,
    updateBook,
    deleteBook,

    // Transactions
    recordTransaction,

    // Users
    addUser,
    updateUser,
    deleteUser,
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};
