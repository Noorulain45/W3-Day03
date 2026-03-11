// models/Task.js
// ─────────────────────────────────────────
// This defines what a "Task" looks like
// in the MongoDB database.
// ─────────────────────────────────────────

const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'done'],   // only these two values allowed
    default: 'pending'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',                 // links this task to a specific user
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)