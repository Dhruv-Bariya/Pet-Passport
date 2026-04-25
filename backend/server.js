/**
 * server.js — PetPassport Express Server
 * ----------------------------------------
 * Automatically uses an in-memory MongoDB if no external MONGO_URI
 * is reachable, so the app works without a local MongoDB install.
 */

require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');

const petsRouter    = require('./routes/pets');
const logsRouter    = require('./routes/logs');
const recordsRouter = require('./routes/records');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ──────────────────────────────────────────── */
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

/* ── Routes ──────────────────────────────────────────────── */
app.use('/api/pets',    petsRouter);
app.use('/api/logs',    logsRouter);
app.use('/api/records', recordsRouter);

/* ── Health check ────────────────────────────────────────── */
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

/* ── 404 handler ─────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

/* ── Global error handler ────────────────────────────────── */
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

/* ── Connect to MongoDB (real or in-memory) ──────────────── */
async function startServer() {
  let mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/petpassport';

  // Try the configured URI first; fall back to in-memory MongoDB
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log('✅  Connected to MongoDB at', mongoUri);
  } catch (err) {
    console.warn('⚠️  Could not connect to', mongoUri, '— falling back to in-memory MongoDB.');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
    await mongoose.connect(mongoUri);
    console.log('✅  Connected to IN-MEMORY MongoDB (data resets on restart)');
    console.log('   URI:', mongoUri);
  }

  app.listen(PORT, () =>
    console.log(`🚀  PetPassport API running on http://localhost:${PORT}`)
  );
}

startServer().catch(err => {
  console.error('❌  Fatal startup error:', err.message);
  process.exit(1);
});
