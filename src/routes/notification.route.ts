import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticateToken } from '../middleware';

const router = Router()
const { checkUnRead, getUserNotifications, markAllRead } = new NotificationController()

router.get('/', authenticateToken, getUserNotifications)
router.get('/check-unread', checkUnRead);
router.post('/mark-all-read', markAllRead);

export default router;
