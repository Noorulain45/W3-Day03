// src/components/LoginForm.jsx
// ─────────────────────────────────────────────
// A simple form that takes email + password,
// calls the login API, and saves the JWT token.
// ─────────────────────────────────────────────

import { useState } from 'react'
import { loginUser } from '../services/api'

export default function LoginForm({ onLoginSuccess }) {
  // Step 1: Store what the user types
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  // Step 2: Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()   // Stop page from refreshing
    setError('')
    setLoading(true)

    try {
      // Step 3: Call the login API
      const response = await loginUser(email, password)

      // Step 4: Save the token to localStorage
      const token = response.data.token  // adjust if your API returns differently
      localStorage.setItem('token', token)

      // Step 5: Tell the parent component login worked
      onLoginSuccess()

    } catch (err) {
      // Show error message if login fails
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Show error if any */}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}