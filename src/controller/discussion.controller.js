import {asyncWrapper} from '@/common';
import {discussionService} from '@/service/discussion.service';
import {StatusCodes} from 'http-status-codes';

const validateInput = async (input) => {
    const {title, content, category, thumbnail, startTime, endTime} = input;

    const isInputValid = (title && content && thumbnail && startTime && endTime) &&
        (category.length <= 3) &&
        (new Date(startTime) >= new Date()) &&
        (new Date(endTime) > new Date(startTime));

    return !!isInputValid;
};

export const discussionController = {
    createDiscussion: asyncWrapper(async (req, res) => {
        try {
            // const validation = await validateInput(req.body);
            //
            // if (!validation) {
            //     return res.status(StatusCodes.BAD_REQUEST).json({message: 'Check all the inputs'});
            // }

            const {title, content, category, image, thumbnail, startTime, endTime, capacity} = req.body;
            const {userId} = req.user;

            const dto = {
                title,
                content,
                category,
                image,
                thumbnail,
                startTime,
                endTime,
                capacity,
                userId
            }
            const discussionId = await discussionService.createDiscussion(dto);

            res.status(StatusCodes.CREATED).json({discussionId, message: 'Create success'});
        }catch (error) {
            console.error(error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'INTERNAL_SERVER_ERROR'});
        }
    }),

    verifyUser: asyncWrapper(async (req, res) => {
        const verification = await discussionService.verifyUser(req);

        if (verification) {
            res.status(StatusCodes.OK).json({message: 'ok'});
        } else {
            res.status(StatusCodes.FORBIDDEN).json({message: 'Permission Denied'});
        }
    }),

    updateDiscussion: asyncWrapper(async (req, res) => {
        try {
            // const validation = await validateInput(req.body);
            //
            // if (!validation) {
            //     return res.status(StatusCodes.BAD_REQUEST).json({message: 'Check all the inputs'});
            // }

            const {title, content, image, thumbnail, endTime, capacity} = req.body;
            const {discussionId} = req.params;
            const {userId} = req.user;

            const dto = {
                discussionId,
                title,
                content,
                image,
                thumbnail,
                endTime,
                capacity,
                userId
            }
            const result = await discussionService.updateDiscussion(dto);

            if (result === 'Not the author') {
                return res.status(StatusCodes.FORBIDDEN).json({message: result});
            }

            res.status(StatusCodes.OK).json({message: 'Update success'});
        }catch (error) {
            console.error(error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'INTERNAL_SERVER_ERROR'});
        }
    }),

    deleteDiscussion: asyncWrapper(async (req, res) => {
        try {
            const {discussionId} = req.params;
            const {userId} = req.user;

            const result = await discussionService.deleteDiscussion(discussionId, userId);

            if (result === 'Not the author') {
                return res.status(StatusCodes.FORBIDDEN).json({message: result});
            }

            res.status(StatusCodes.OK).json({message: 'Delete success'});
        }catch (error) {
            console.error(error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'INTERNAL_SERVER_ERROR'});
        }
    }),

    getDiscussionByPage: asyncWrapper(async (req, res) => {
        try {
            const page = Number(req.query.page) || 1;
            const pageSize = 10;
            const {sort} = req.params;
            const userId = await discussionService.getUserIdFromToken(req);

            const result = await discussionService.getDiscussionByPage(page, pageSize, sort, userId);

            res.status(StatusCodes.OK).json({
                hasMore: result.hasMore,
                discussions: result.discussions,
            });
        }catch (error) {
            console.error(error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'INTERNAL_SERVER_ERROR'});
        }
    }),

    getDiscussionByDetail: asyncWrapper(async (req, res) => {
        try {
            const {discussionId} = req.params;
            const userId = await discussionService.getUserIdFromToken(req);

            const {result, discussion} = await discussionService.getDiscussionByDetail(discussionId, userId);

            result.view = await discussionService.increaseViewCount(req.ip, discussion);

            res.status(StatusCodes.OK).json(result);
        }catch (error) {
            console.error(error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'INTERNAL_SERVER_ERROR'});
        }
    }),

    toggleLike: asyncWrapper(async (req, res) => {
        try {
            const {discussionId} = req.params;
            const {userId} = req.user;

            const like = await discussionService.toggleLike(userId, discussionId);

            if (!like.isLiked) {
                res.status(StatusCodes.OK).json({liked: true, like: like.likeCount, message: "Like success"});
            } else {
                res.status(StatusCodes.OK).json({liekd: false, like: like.likeCount, message: "Like cancel success"});
            }
        } catch (error) {
            console.error(error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'INTERNAL_SERVER_ERROR'});
        }
    }),

    createDiscussionUser: asyncWrapper(async (req, res) => {
        try {
            const {discussionId} = req.params;
            const {userId} = req.user;

            const result = await discussionService.createDiscussionUser(userId, discussionId);

            if (result === 'Banned user') {
                res.status(StatusCodes.FORBIDDEN).json({message: 'Banned user'});
            }else if (result === 'Already participating') {
                res.status(StatusCodes.CONFLICT).json({message: 'Already participating'});
            } else {
                res.status(StatusCodes.CREATED).json({message: "Participate success"});
            }
        } catch (error) {
            console.error(error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'INTERNAL_SERVER_ERROR'});
        }
    }),

    deleteDiscussionUser: asyncWrapper(async (req, res) => {
        try {
            const {discussionId} = req.params;
            const {userId} = req.user;

            const result = await discussionService.deleteDiscussionUser(userId, discussionId);

            if (result === 'Banned user') {
                res.status(StatusCodes.FORBIDDEN).json({message: 'Banned user'});
            }else if (result === 'Not participating') {
                res.status(StatusCodes.NOT_FOUND).json({message: 'Not participating'});
            } else {
                res.status(StatusCodes.OK).json({message: "Successfully left the discussion"});
            }
        } catch (error) {
            console.error(error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'INTERNAL_SERVER_ERROR'});
        }
    }),
}
