// src/pages/Dashboard.jsx
// ─────────────────────────────────────────────
// The main page after login.
// Fetches tasks from the API and shows them.
// Also has a navbar with logout.
// ─────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTasks } from '../services/api'
import TaskForm from '../components/taskform'
import TaskList from '../components/tasklist'

export default function Dashboard() {
  const [tasks, setTasks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const navigate = useNavigate()

  // ── Fetch tasks when page loads ──
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks()
        setTasks(response.data)         // store tasks in state
      } catch (err) {
        if (err.response?.status === 401) {
          // Token expired or invalid → send back to login
          localStorage.removeItem('token')
          navigate('/login')
        } else {
          setError('Failed to load tasks.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [navigate])   // runs once when component mounts

  // ── Logout ──
  const handleLogout = () => {
    localStorage.removeItem('token')   // remove JWT
    navigate('/login')
  }

  // ── Called when a new task is created ──
  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks])      // add to top of list
  }

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="navbar">
        <h2>📝 TaskFlow</h2>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      {/* ── Main Content ── */}
      <div className="dashboard">
        <h2>My Tasks</h2>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Task creation form */}
        <TaskForm onTaskCreated={handleTaskCreated} />

        {/* Task list */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Loading tasks...</p>
        ) : (
          <TaskList tasks={tasks} onTasksChange={setTasks} />
        )}
      </div>
    </>
  )
}