import express from 'express';
import {commentController} from '@/controller/comment.controller';

const router = express.Router();
import { isAuthenticated, isAuthorized } from "@/middleware";

// 토큰 검증 필요 x
router.get('/comments', commentController.getCommentByPage);

// 토큰 검증 필요 o
router.post('/comments', isAuthorized, commentController.createComment);
router.patch('/comments/:commentId', isAuthorized, commentController.updateComment);
router.delete('/comments/:commentId', isAuthorized, commentController.deleteComment);


export default router;