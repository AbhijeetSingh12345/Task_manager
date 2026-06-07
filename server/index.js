const express = require('express');
const cors    = require('cors');
const taskRoutes = require('./routes/tasks');

const app  = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());  

app.use(express.json());  // Parse JSON request bodies

// Routes
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

// Start server (only when run directly, not during tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;  // Export for testing

