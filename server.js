import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import masRoutes from './routes/masRoutes.js';
import connectDB from './config/db.js';


config();
////////////////////////
const app = express();

/////////////////////
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/', masRoutes);

// Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Server error', error: err.message });
});

// Run Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at ${PORT}`);
});
