import express from 'express';
import { createPost, updatePost, deletePost, getByPostDetail, getByAllList } from '@/controller';
const router = express.Router();
import { isAuthenticated, isAuthorized } from "@/middleware";

router.route('/post').post(isAuthorized, createPost); // POST /posts로 변경하세요
router.route('/post/:id')
    .delete(isAuthorized, deletePost)
    .patch(isAuthorized, updatePost);
router.route('/post').get(getByPostDetail); // GET /posts/:id로 Detail 조회시키세요
router.route('/posts').get(getByAllList);

export default router;