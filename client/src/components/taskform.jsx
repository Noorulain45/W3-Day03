// src/components/TaskForm.jsx
// ─────────────────────────────────────────────
// Form to CREATE a new task.
// Calls the POST /api/tasks endpoint.
// ─────────────────────────────────────────────

import { useState } from 'react'
import { createTask } from '../services/api'

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle]       = useState('')
  const [description, setDesc]  = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    setError('')

    try {
      // POST to /api/tasks with title + description
      const response = await createTask({ title, description })

      // Tell parent (Dashboard) to refresh the task list
      onTaskCreated(response.data)

      // Clear the form
      setTitle('')
      setDesc('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="task-form-card">
      <h3>➕ Add New Task</h3>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="task-form-row">
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              placeholder="e.g. Fix login bug"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description (optional)</label>
            <input
              type="text"
              placeholder="Short description..."
              value={description}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  )
}