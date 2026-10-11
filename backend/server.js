require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB, getDBStatus } = require('./config/db');
const { isCloudinaryConfigured } = require('./config/cloudinary');

const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
const localOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

const configuredClientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/+$/, '') : null;

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server or non-browser requests (like curl, Postman, health probes)
      if (!origin) return callback(null, true);

      // Allow configured production client URL
      if (configuredClientUrl && (origin === configuredClientUrl || origin === configuredClientUrl.replace(/\/+$/, ''))) {
        return callback(null, true);
      }

      // Allow local development origins
      if (localOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview and production deployments (*.vercel.app)
      if (/\.vercel\.app$/.test(new URL(origin).hostname)) {
        return callback(null, true);
      }

      // If not production, remain permissive for testing
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health & Status route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: getDBStatus() ? 'connected (MongoDB)' : 'in-memory active store',
      cloudinary: isCloudinaryConfigured() ? 'configured' : 'local mock store',
      geminiAi: Boolean(process.env.GEMINI_API_KEY) ? 'configured' : 'heuristic engine active',
    },
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);

  // Multer specific errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds maximum 10MB limit.',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 OK-CV Backend Server listening on port ${PORT}`);
  console.log(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});
