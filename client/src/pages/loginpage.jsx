// src/pages/LoginPage.jsx
// ─────────────────────────────────────────────
// This is the full Login Page.
// It wraps the LoginForm component in a nice card.
// After login, it redirects to /dashboard.
// ─────────────────────────────────────────────

import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/loginform'

export default function LoginPage() {
  const navigate = useNavigate()

  // Called by LoginForm when login succeeds
  const handleLoginSuccess = () => {
    navigate('/dashboard')   // 👈 Go to dashboard after login
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>📝 TaskFlow</h1>
        <p>Sign in to manage your tasks</p>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  )
}