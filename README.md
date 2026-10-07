# Community Library Management System

A full-featured Library Management System built with React. It lets librarians/admins manage books, transactions, and users, with a dashboard showing stock availability and low-stock alerts. All data is persisted in the browser's Local Storage.

## Features

- **Login & Authentication** — membership ID + password login, session persisted in Local Storage
- **Dashboard** — stats cards (total books, total stock, low stock, registered users) and a searchable book availability table with low-stock highlighting (< 2 copies)
- **Book Management** — add, update, delete books with ISBN uniqueness validation
- **Transactions** — record stock additions (new arrivals) and deductions (borrowed), with a full transaction history and stock validation (can't deduct more than available)
- **User Management** (admin only) — add, update, delete users; protects the last admin and prevents deleting your own account
- **Role-based access** — members cannot access User Management
- **Responsive UI** — sidebar layout, works on smaller screens

## Tech Stack

- React (Create React App)
- React Router DOM
- React Context API + Hooks (`useState`, `useEffect`, `useContext`)
- Local Storage for persistence

## Project Structure

```
src/
├── components/       # Reusable components (Layout, forms, lists, ProtectedRoute)
├── pages/            # Pages (Login, Dashboard, Books, Transactions, Users)
├── context/          # LibraryContext — global state management
├── utils/            # storage.js — Local Storage helpers
├── App.js            # Router setup
└── index.js
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)

### Install & Run

```bash
npm install
npm start
```

Then open http://localhost:3000

### Default Admin Login
```
Membership ID: ADMIN001
Password:      admin123
```

## Available Scripts

- `npm start` — run the development server
- `npm run build` — create a production build
- `npm test` — run tests

## Notes

- This was built as a student assignment demonstrating React fundamentals: components, hooks, Context, Router, controlled forms, and Local Storage.
