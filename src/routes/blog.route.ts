import { Router } from 'express';
import { BlogController } from '../controllers/blog.controller'
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();
const { createBlog, getAllBlogs, getSingleBlog, updateBlog } = new BlogController()

router.get('/', getAllBlogs);
router.post('/', upload.single('image'), createBlog);
router.put('/:id', upload.single('image'), updateBlog);
router.get('/:slug', getSingleBlog);

export default router;
