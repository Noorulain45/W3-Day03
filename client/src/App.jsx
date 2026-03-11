// src/App.jsx
// ─────────────────────────────────────────────
// This is the ROOT of the app.
// It sets up all routes and the ProtectedRoute guard.
// ─────────────────────────────────────────────

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/loginpage'
import Dashboard from './pages/dashboard'

// ── ProtectedRoute ──────────────────────────────
// If the user is NOT logged in (no token),
// send them to /login automatically.
// ────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />   // 👈 redirect to login
  }

  return children   // 👈 user is logged in, show the page
}

// ── App Routes ──────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public route - anyone can visit */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected route - only logged in users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Default: redirect / to /dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  )
}