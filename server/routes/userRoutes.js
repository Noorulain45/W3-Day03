// routes/userRoutes.js
// ─────────────────────────────────────────
// Two routes:
//   POST /api/users/register  → create account
//   POST /api/users/login     → login + get JWT
// ─────────────────────────────────────────

const express = require('express')
const jwt     = require('jsonwebtoken')
const User    = require('../models/user')

const router = express.Router()

// ── Helper: generate a JWT token ──
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// ─────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User registration and login
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 664f1b2c9a4e2d001f8e4abc
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john@example.com
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Email already registered
 *       500:
 *         description: Server error
 */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const user = await User.create({ name, email, password })

    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      token: generateToken(user._id)
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─────────────────────────────────────────

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login and receive a JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful, returns user info and token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 664f1b2c9a4e2d001f8e4abc
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john@example.com
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      token: generateToken(user._id)
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router