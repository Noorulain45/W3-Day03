// src/services/api.js
// ─────────────────────────────────────────────
// This file sets up Axios with your backend URL
// and automatically attaches the JWT token
// to every request that needs authentication.
// ─────────────────────────────────────────────

import axios from 'axios'

// 👇 Change this to your actual backend URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// Automatically add JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Auth ──
export const loginUser = (email, password) =>
  API.post('/users/login', { email, password })

// ── Tasks ──
export const getTasks    = ()           => API.get('/tasks')
export const createTask  = (taskData)   => API.post('/tasks', taskData)
export const updateTask  = (id, data)   => API.put(`/tasks/${id}`, data)
export const deleteTask  = (id)         => API.delete(`/tasks/${id}`)

export default API