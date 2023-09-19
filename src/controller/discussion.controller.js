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
            const validation = await validateInput(req.body);

            if (!validation) {
                return res.status(StatusCodes.BAD_REQUEST).json({message: 'Check all the inputs'});
            }

            const {title, content, category, image, thumbnail, startTime, endTime} = req.body;
            const {userId} = req.user;

            const dto = {
                title,
                content,
                category,
                image,
                thumbnail,
                startTime,
                endTime,
                userId
            }
            await discussionService.createDiscussion(dto);

            res.status(StatusCodes.CREATED).json({message: 'Create success'});
        }catch (error) {
            console.error(error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'INTERNAL_SERVER_ERROR'});
        }
    }),

    updatediscussion: asyncWrapper(async (req, res) => {
        try {
            const validation = await validateInput(req.body);

            if (!validation) {
                return res.status(StatusCodes.BAD_REQUEST).json({message: 'Check all the inputs'});
            }

            const {title, content, category, image, thumbnail, startTime, endTime} = req.body;
            const {discussionId} = req.params;
            const {userId} = req.user;

            const dto = {
                discussionId,
                title,
                content,
                category,
                image,
                thumbnail,
                startTime,
                endTime,
                userId
            }
            await discussionService.updateDiscussion(dto);

            res.status(StatusCodes.OK).json({message: 'Update success'});
        }catch (error) {
            console.error(error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'INTERNAL_SERVER_ERROR'});
        }
    }),
}
