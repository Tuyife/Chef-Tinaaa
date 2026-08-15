import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// API health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Root — simple status so the hosted API responds to a direct visit.
app.get('/', (_req, res) =>
  res.json({ name: 'Glory Catering Service API', status: 'ok', health: '/api/health' }),
);

// Public offline payment details (bank transfer info configured in .env)
app.get('/api/payment-details', (_req, res) => {
  const get = (k) => process.env[k] || '';
  res.json({
    bankName: get('PAYMENT_BANK_NAME'),
    accountName: get('PAYMENT_ACCOUNT_NAME'),
    accountNumber: get('PAYMENT_ACCOUNT_NUMBER'),
    instructions: get('PAYMENT_INSTRUCTIONS'),
    enabled: Boolean(
      get('PAYMENT_BANK_NAME') ||
        get('PAYMENT_ACCOUNT_NAME') ||
        get('PAYMENT_ACCOUNT_NUMBER') ||
        get('PAYMENT_INSTRUCTIONS'),
    ),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/admin', adminRoutes);

// 404 for unknown API routes
app.use('/api', (_req, res) => res.status(404).json({ message: 'API endpoint not found' }));

// Central error handler
app.use((err, _req, res, _next) => {
  console.error('[error]', err.message);
  const status = err.statusCode || 500;
  const message = status === 500 ? 'Something went wrong. Please try again.' : err.message;
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`[server] Glory Catering Service API running on port ${PORT}`));
});
