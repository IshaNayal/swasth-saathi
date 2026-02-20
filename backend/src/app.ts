import mlRoutes from './routes/mlRoutes';
app.use(mlRoutes);
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(morgan('dev'));
app.use(express.json());

app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth routes
import authRoutes from './routes/authRoutes';
app.use(authRoutes);

export default app;
