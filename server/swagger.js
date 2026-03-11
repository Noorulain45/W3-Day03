// swagger.js
// ─────────────────────────────────────────
// Swagger configuration for TaskFlow API
// Docs available at: http://localhost:5000/api-docs
// ─────────────────────────────────────────

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi    = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'API documentation for TaskFlow — register, login, and manage your tasks.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    // ── This enables the Authorize 🔒 button in Swagger UI ──
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Paste your JWT token here. Get it from /api/users/login',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // scans all route files for @swagger comments
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  console.log('📄 Swagger docs → http://localhost:5000/api-docs')
}

module.exports = swaggerDocs