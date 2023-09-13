import {asyncWrapper} from '@/common';
import {commentService} from '@/service/comment.servicce';
import {postService} from "@/service/post.service";
import {StatusCodes} from 'http-status-codes';

export const commentController = {
    createComment: asyncWrapper(async (req, res) => {
        try {
            const {userId} = req.user;
            const postId = req.params.id;
            const {content, parentId} = req.body;

            const result = await commentService.createComment(userId, postId, content, parentId);

            res.status(StatusCodes.CREATED).json(result);
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }),

    getCommentByPage: asyncWrapper(async (req, res) => {
        try {
            const postId = req.params.id;
            const page = Number(req.query.page) || 1; // 기본 페이지 1
            const pageSize = 10;
            const userId = await postService.getUserIdFromToken(req);

            const result = await commentService.getCommentByPage(postId, page, pageSize, userId);

            res.status(201).json({
                result
            })
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }),
}
