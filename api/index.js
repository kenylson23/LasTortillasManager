import express from 'express';
import cors from 'cors';
import { registerRoutes } from '../server/routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register routes
registerRoutes(app);

// Export for Vercel
export default app;