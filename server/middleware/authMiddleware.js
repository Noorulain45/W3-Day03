// middleware/authMiddleware.js
// ─────────────────────────────────────────
// This runs BEFORE any protected route.
// It checks if the request has a valid JWT token.
// If not → returns 401 Unauthorized.
// If yes → attaches the user to req.user.
// ─────────────────────────────────────────

const jwt  = require('jsonwebtoken')
const User = require('../models/user')

const protect = async (req, res, next) => {
  let token

  // Check if token is in the Authorization header
  // Format: "Bearer eyJhbGci..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract just the token part (remove "Bearer ")
      token = req.headers.authorization.split(' ')[1]

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Find the user from the token's id, exclude password
      req.user = await User.findById(decoded.id).select('-password')

      next()   // ✅ token is valid — continue to the route

    } catch (err) {
      return res.status(401).json({ message: 'Token is invalid or expired' })
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' })
  }
}

module.exports = { protect }