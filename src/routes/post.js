import express from 'express';
import { createPost, updatePost } from '@/controller/index.js';
const router = express.Router();

router.route('/post').post(createPost);
router.route('/post/:id').patch(updatePost);

export default router;