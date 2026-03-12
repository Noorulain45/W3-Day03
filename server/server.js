const express    = require('express')
const mongoose   = require('mongoose')
const cors       = require('cors')
require('dotenv').config()

const swaggerDocs = require('./swagger') // 👈 ADD THIS

const app = express()

// ── Middleware ──────────────────────────────
app.use(cors({ 
  origin: ['http://localhost:5173', 'https://w3-day03.vercel.app/login'] }))
app.use(express.json())

swaggerDocs(app) // 👈 ADD THIS (connect Swagger)

// ── Routes ─────────────────────────────────
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tasks', require('./routes/taskRoutes'))

// ── Test route ──
app.get('/', (req, res) => {
  res.json({ message: '✅ TaskFlow API is running!' })
})

// ── Connect to MongoDB then start server ───
const PORT = process.env.PORT || 5000


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected!')
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on http://localhost:${PORT}`)
      // 👈 Swagger log will automatically print here too
    })
  })
  .catch((err) => {
    console.log('❌ MongoDB connection failed:', err.message)
    process.exit(1) // 👈 add this
  })