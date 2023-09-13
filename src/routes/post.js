import express from 'express';
import {postController} from '@/controller/post.controller';

const router = express.Router();
import { isAuthenticated, isAuthorized } from "@/middleware";

// 토큰 검증 필요 x
router.get('/post/all/:sort', postController.getPostsByPage);
router.get('/post/detail/:id', postController.getByPostDetail);
router.get('/post/:id/verification', postController.verifyUser);
router.get('/post/:id/comment', postController.getCommentByPage);

// 토큰 검증 필요 o
router.use(isAuthorized);
router.post('/post', postController.createPost);
router.post('/post/:id/bookmark', postController.toggleBookmark);
router.post('/post/:id/like', postController.toggleLike);
router.post('/post/:id/comment', postController.createComment);
router.patch('/post/:id', postController.updatePost);
router.delete('/post/:id', postController.deletePost);

export default router;