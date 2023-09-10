import express from 'express';
import {postController} from '@/controller/post.controller';

const router = express.Router();
import { isAuthenticated, isAuthorized } from "@/middleware";

// 토큰 검증 필요 x
router.get('/post/all/:sort', postController.getPostsByPage);
router.get('/post/detail/:id', postController.getByPostDetail);
router.get('/post/:id/verification', postController.verifyUser);

// 토큰 검증 필요 o
router.use(isAuthenticated);
router.post('/post', postController.createPost);
router.post('/post/bookmark', postController.toggleBookm정ark);
router.post('/post/like', postController.toggleLike);
router.patch('/post/:id', postController.updatePost);
router.delete('/post/:id', postController.deletePost);

export default router;