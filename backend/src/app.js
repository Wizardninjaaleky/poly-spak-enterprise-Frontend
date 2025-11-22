
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
// Removed adminRoutes routing after migration

const app = express();

app.use(cors());
app.use(express.json());

// API routes

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Removed admin related routes after migration
// app.use('/api/admin', adminRoutes);
// app.use('/api/admin/products', productRoutes);

// health

app.get('/', (req, res) => res.json({ success: true, message: 'API running' }));

export default app;
