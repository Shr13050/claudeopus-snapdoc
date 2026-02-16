import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';

import apiRoutes from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Logging Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        service: 'SnapDoc Intelligence API',
        model: 'Claude 3.7 / Opus 4.6'
    });
});

// API Routes
app.use('/api', apiRoutes);

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`
🚀 SnapDoc Backend is soaring!
🌍 Core: http://localhost:${PORT}
🧠 Intelligence: Enabled (Claude 3.7 / Opus 4.6)
    `);
});
