import multer from 'multer';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware';
import { Router } from 'express';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();
const { signup, login, getCurrentUser } = new AuthController();

router.post('/signup', upload.single('avatar'), signup);
router.post('/login', login);
router.get('/me', authenticateToken, getCurrentUser);

export default router;
