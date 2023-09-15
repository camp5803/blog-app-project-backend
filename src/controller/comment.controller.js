import {asyncWrapper} from '@/common';
import {commentService} from '@/service/comment.servicce';
import {postService} from "@/service/post.service";
import {StatusCodes} from 'http-status-codes';

export const commentController = {
    createComment: asyncWrapper(async (req, res) => {
        try {
            const {userId} = req.user;
            const {content, parentId, postId} = req.body;

            const result = await commentService.createComment(userId, postId, content, parentId);

            res.status(StatusCodes.CREATED).json({message: 'create success'});
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }),

    getCommentByPage: asyncWrapper(async (req, res) => {
        try {
            const {postId} = req.query;
            const page = Number(req.query.page) || 1; // 기본 페이지 1
            const pageSize = 10;
            const userId = await postService.getUserIdFromToken(req);

            const result = await commentService.getCommentByPage(postId, page, pageSize, userId);

            res.status(StatusCodes.OK).json(result)
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }),

    updateComment: asyncWrapper(async (req, res) => {
        try {
            const {userId} = req.user;
            const commentId = req.params.commentId;
            const {content} = req.body;

            const result = await commentService.updateComment(userId, commentId, content);

            if (result) {
                res.status(StatusCodes.OK).json({message: 'update success'});
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({message: 'update fail'});
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }),

    deleteComment: asyncWrapper(async (req, res) => {
        try {
            const {userId} = req.user;
            const commentId = req.params.commentId;

            const result = await commentService.deleteComment(userId, commentId);

            if (result) {
                res.status(StatusCodes.OK).json({message: 'delete success'});
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({message: 'delete fail'});
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }),
}
