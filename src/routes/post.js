import express from 'express';
import {postController} from '@/controller/post.controller';

const router = express.Router();
import { isAuthenticated, isAuthorized } from "@/middleware";

// 토큰 검증 필요 x
router.get('/post/all/:sort', postController.getPostsByPage);
router.get('/post/detail/:id', postController.getByPostDetail);
router.get('/post/:id/verification', postController.verifyUser);
router.get('/post/:id/:type', postController.getMyPosts);

// 토큰 검증 필요 o
router.post('/post', isAuthorized, postController.createPost);
router.post('/post/:id/bookmark', isAuthorized, postController.toggleBookmark);
router.post('/post/:id/like', isAuthorized, postController.toggleLike);
router.patch('/post/:id', isAuthorized, postController.updatePost);
router.delete('/post/:id', isAuthorized, postController.deletePost);

export default router;