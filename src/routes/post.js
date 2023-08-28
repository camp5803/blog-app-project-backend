import express from 'express';
import { createPost, updatePost, deletePost, getByPostDetail } from '@/controller/index.js';
const router = express.Router();

router.route('/post').post(createPost);
router.route('/post/:id').patch(updatePost);
router.route('/post/:id').delete(deletePost);
router.route('/post').get(getByPostDetail);

export default router;