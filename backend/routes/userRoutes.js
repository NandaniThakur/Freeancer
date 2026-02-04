import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes - add your user-related routes here
// All routes below use authenticateToken for protection

router.get('/profile', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'User profile', user: req.user });
});

export default router;
