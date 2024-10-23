import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware';
import { CommentController } from '../controllers/comment.controller';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

const { addComment, addReply, deleteComment, getComments, getReplies} = new CommentController()

router.get('/:slug/comments', getComments);
router.post('/:slug/comments', authenticateToken, upload.single('image'), addComment );
router.post('/comments/:commentId', authenticateToken, upload.single('image'), addReply );
router.delete('/comments/:commentId', authenticateToken, deleteComment);
router.get('/comments/:commentId', getReplies);

export default router;
