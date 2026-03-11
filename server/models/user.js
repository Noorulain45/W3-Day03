// models/User.js
// ─────────────────────────────────────────
// This defines what a "User" looks like
// in the MongoDB database.
// ─────────────────────────────────────────

const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,       // no two users with same email
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, { timestamps: true })   // adds createdAt and updatedAt automatically

// ── Hash password before saving ──
// This runs automatically before every .save()
userSchema.pre('save', async function (next) {
  // Only hash if password was changed
  if (!this.isModified('password')) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// ── Method to check password at login ──
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)