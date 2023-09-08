import express from 'express';
import {
    createPost,
    updatePost,
    deletePost,
    getByPostDetail,
    getPostsByPage,
    toggleBookmark,
    toggleLike,
    verifyUser
} from '@/controller/post.controller';

const router = express.Router();
import { isAuthenticated, isAuthorized } from "@/middleware";

// 토큰 검증 필요 x
router.get('/post/all/:sort/:id', getPostsByPage);
router.get('/post/detail/:id', getByPostDetail);
router.get('/post/:id/verification', verifyUser);

// 토큰 검증 필요 o
router.use(isAuthenticated);
router.post('/post', createPost);
router.post('/post/bookmark', toggleBookmark);
router.post('/post/like', toggleLike);
router.patch('/post/:id', updatePost);
router.delete('/post/:id', deletePost);

export default router;