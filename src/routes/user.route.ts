import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router()
const { list } = new UserController()

router.get('/', list)

export default router;
