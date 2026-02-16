import express from 'express';
import { chatWithAI } from '../controllers/chatController.js';
import { analyzeTechnology } from '../controllers/techController.js';

const router = express.Router();

// Chat routes
router.post('/chat', chatWithAI);

// Tech analysis routes
router.post('/analyze-tech', analyzeTechnology);

export default router;
