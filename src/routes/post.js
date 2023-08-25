import express from 'express';
import { createPost } from '@/controller/index.js';
const router = express.Router();

router.route('/post').post(createPost);

export default router;