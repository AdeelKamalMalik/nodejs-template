import { Router } from 'express';
import { UserController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware';

const router = Router();
const { login, signup, getCurrentUser } = new UserController()

router.post('/signup', signup)
router.post('/login', login)
router.get('/me', authenticateToken, getCurrentUser);

export default router;
