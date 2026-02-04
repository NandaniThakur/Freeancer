import express from 'express';
import { signUp, logIn, logOut, refreshToken } from '../controller/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/logout', logOut);
router.post('/refresh', refreshToken);
router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'User authenticated', user: req.user });
});

export default router;
