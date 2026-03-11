// routes/taskRoutes.js
// ─────────────────────────────────────────
// All task routes are protected.
// The user must send a valid JWT token.
//
//   GET    /api/tasks        → get all my tasks
//   POST   /api/tasks        → create a task
//   PUT    /api/tasks/:id    → update a task
//   DELETE /api/tasks/:id    → delete a task
// ─────────────────────────────────────────

const express = require('express')
const Task    = require('../models/task')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// All routes below require a valid token
router.use(protect)

// ─────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management (requires JWT token)
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 664f1b2c9a4e2d001f8e4abc
 *                   title:
 *                     type: string
 *                     example: Buy groceries
 *                   description:
 *                     type: string
 *                     example: Milk, eggs, bread
 *                   status:
 *                     type: string
 *                     example: pending
 *                   user:
 *                     type: string
 *                     example: 664f1b2c9a4e2d001f8e4abc
 *       401:
 *         description: Not authorized, token missing or invalid
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─────────────────────────────────────────

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Buy groceries
 *               description:
 *                 type: string
 *                 example: Milk, eggs, bread
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 664f1b2c9a4e2d001f8e4abc
 *                 title:
 *                   type: string
 *                   example: Buy groceries
 *                 description:
 *                   type: string
 *                   example: Milk, eggs, bread
 *                 status:
 *                   type: string
 *                   example: pending
 *                 user:
 *                   type: string
 *                   example: 664f1b2c9a4e2d001f8e4abc
 *       400:
 *         description: Title is required
 *       401:
 *         description: Not authorized, token missing or invalid
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  const { title, description } = req.body

  if (!title) {
    return res.status(400).json({ message: 'Title is required' })
  }

  try {
    const task = await Task.create({
      title,
      description,
      user: req.user._id
    })
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─────────────────────────────────────────

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *         example: 664f1b2c9a4e2d001f8e4abc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated task title
 *               description:
 *                 type: string
 *                 example: Updated description
 *               status:
 *                 type: string
 *                 example: completed
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       401:
 *         description: Not authorized, token missing or invalid
 *       403:
 *         description: Not authorized to edit this task
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this task' })
    }

    task.title       = req.body.title       ?? task.title
    task.description = req.body.description ?? task.description
    task.status      = req.body.status      ?? task.status

    const updatedTask = await task.save()
    res.json(updatedTask)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─────────────────────────────────────────

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *         example: 664f1b2c9a4e2d001f8e4abc
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task deleted successfully
 *       401:
 *         description: Not authorized, token missing or invalid
 *       403:
 *         description: Not authorized to delete this task
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' })
    }

    await task.deleteOne()
    res.json({ message: 'Task deleted successfully' })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router