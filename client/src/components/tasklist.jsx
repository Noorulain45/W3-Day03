// src/components/TaskList.jsx
// ─────────────────────────────────────────────
// Displays all tasks.
// Supports: mark as done (PUT), delete (DELETE),
// and inline edit.
// ─────────────────────────────────────────────

import { useState } from 'react'
import { updateTask, deleteTask } from '../services/api'

export default function TaskList({ tasks, onTasksChange }) {
  // Track which task is being edited
  const [editingId, setEditingId]     = useState(null)
  const [editTitle, setEditTitle]     = useState('')
  const [editDesc, setEditDesc]       = useState('')

  // ── Delete a task ──
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await deleteTask(id)
      // Remove from list without re-fetching
      onTasksChange(tasks.filter(t => t._id !== id))
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Failed to delete task.')
    }
  }

  // ── Start editing a task ──
  const startEdit = (task) => {
    setEditingId(task._id)
    setEditTitle(task.title)
    setEditDesc(task.description || '')
  }

  // ── Save edited task ──
  const saveEdit = async (id) => {
    try {
      const response = await updateTask(id, { title: editTitle, description: editDesc })
      // Replace old task with updated one
      onTasksChange(tasks.map(t => t._id === id ? response.data : t))
      setEditingId(null)
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Failed to update task.')
    }
  }

  // ── Toggle done/pending ──
  const toggleStatus = async (task) => {
    const newStatus = task.status === 'done' ? 'pending' : 'done'
    try {
      const response = await updateTask(task._id, { status: newStatus })
      onTasksChange(tasks.map(t => t._id === task._id ? response.data : t))
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Failed to update status.')
    }
  }

  // ── Empty state ──
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>📋 No tasks yet. Add one above!</p>
      </div>
    )
  }

  return (
    <div>
      {tasks.map((task) => (
        <div key={task._id} className={`task-item ${task.status === 'done' ? 'done' : ''}`}>

          {/* ── Edit Mode ── */}
          {editingId === task._id ? (
            <div style={{ flex: 1 }}>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ marginBottom: 6, padding: '6px 10px', border: '1px solid #ddd', borderRadius: 6, width: '100%' }}
              />
              <input
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Description..."
                style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: 6, width: '100%' }}
              />
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                <button className="btn-edit" onClick={() => saveEdit(task._id)}>💾 Save</button>
                <button className="btn-danger" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            /* ── View Mode ── */
            <>
              <div className="task-info">
                <h4>{task.title}</h4>
                {task.description && <p>{task.description}</p>}
                <span className={`badge ${task.status === 'done' ? 'badge-done' : 'badge-pending'}`}>
                  {task.status || 'pending'}
                </span>
              </div>

              <div className="task-actions">
                <button className="btn-edit" onClick={() => toggleStatus(task)}>
                  {task.status === 'done' ? '↩ Undo' : '✓ Done'}
                </button>
                <button className="btn-edit" onClick={() => startEdit(task)}>✏️ Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(task._id)}>🗑 Delete</button>
              </div>
            </>
          )}

        </div>
      ))}
    </div>
  )
}