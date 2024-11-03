import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { RequestWithUser } from '../types';

const notificationService = new NotificationService();

export class NotificationController {
  async getUserNotifications(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const notifications = await notificationService.getUserNotifications(userId);
      res.status(200).json(notifications);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const { notificationId } = req.params;
      await notificationService.markAsRead(notificationId);
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async markAllRead(req: RequestWithUser, res: Response) {
    try {
      const { user_id } = req;
      await notificationService.markAllRead(user_id);
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async checkUnRead(req: RequestWithUser, res: Response) {
    try {
      const { user_id } = req;
      const newPresent = await notificationService.checkUnRead(user_id)
      res.status(200).json({ newPresent });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
