import express from 'express';
import { createPost, updatePost, deletePost, getByPostDetail, getPostsByPage, toggleBookmark, toggleLike } from '@/controller';
const router = express.Router();
import { isAuthenticated, isAuthorized } from "@/middleware";

router.route('/post').post(createPost);
router.route('/post/:id').patch(updatePost);
router.route('/post/:id').delete(deletePost);
router.route('/post/detail/:id').get(getByPostDetail);
router.route('/post/all/:sort/:id').get(getPostsByPage); 
router.route('/post/bookmark').post(toggleBookmark);
router.route('/post/like').post(toggleLike);

export default router;