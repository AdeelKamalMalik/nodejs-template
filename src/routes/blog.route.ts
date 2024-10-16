import { Router } from 'express';
import { BlogController } from '../controllers/blog.controller'

const router = Router();
const { createBlog, getAllBlogs, getSingleBlog, updateBlog } = new BlogController()

router.post('/', createBlog);
router.put('/:id', updateBlog);
router.get('/', getAllBlogs);
router.get('/:slug', getSingleBlog);

export default router;
