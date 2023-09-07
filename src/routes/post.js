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

router.get('/post/all/:sort/:id').get(getPostsByPage);
router.get('/post/detail/:id').get(getByPostDetail);

router.use(isAuthenticated);
router.post('/post', createPost);
router.get('/post/:id/verification', verifyUser);
router.post('/post/bookmark').post(toggleBookmark);
router.post('/post/like').post(toggleLike);
router.patch('/post/:id', updatePost);
router.delete('/post/:id').delete(deletePost);

export default router;