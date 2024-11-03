import { Repository } from 'typeorm';
import { Notification } from '../entity/Notification';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { Blog } from '../entity/Blog';
import { Comment } from '../entity/Comment';

export class NotificationService {
  private notificationRepository: Repository<Notification>;

  constructor() {
    if (!AppDataSource.isInitialized) {
      AppDataSource.initialize().then(() => {
        this.notificationRepository = AppDataSource.getRepository(Notification);
      }).catch(error => {
        console.error('Error during Data Source initialization:', error);
      });
    } else {
      this.notificationRepository = AppDataSource.getRepository(Notification);
    }
  }

  async createNotification(user: User, sender: User, blog: Blog, comment: Comment, type: string) {
    const notification = this.notificationRepository.create({
      user,
      sender,
      blog,
      comment,
      type,
      read: false,
    });
    return await this.notificationRepository.save(notification);
  }

  async markAsRead(notificationId: string) {
    await this.notificationRepository.update(notificationId, { read: true });
  }

  async markAllRead(userId: string) {
    await this.notificationRepository.update({ user: { id: userId } }, { read: true });
  }

  async checkUnRead(userId: string) {
    await this.notificationRepository.find({ where: { user: { id: userId }, read: false } });
  }

  async getUserNotifications(userId: string) {
    return await this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}
