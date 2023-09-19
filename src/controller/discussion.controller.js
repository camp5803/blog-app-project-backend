import {asyncWrapper} from '@/common';
import {discussionService} from '@/service/discussion.service';
import {StatusCodes} from 'http-status-codes';

export const discussionController = {
    createDiscussion: asyncWrapper(async (req, res) => {
        try {
            const {title, content, category, image, thumbnail, startTime, endTime} = req.body;
            const {userId} = req.user;

            if (!(title && content && thumbnail && startTime && endTime)) {
                return res.status(StatusCodes.BAD_REQUEST).json({message: 'Check all the inputs'});
            }

            if (category.length > 3) {
                return res.status(StatusCodes.BAD_REQUEST).json({message: 'Up to 3 categories can be registered'});
            }

            if (new Date(startTime) < new Date()) {
                return res.status(StatusCodes.BAD_REQUEST).json({message: 'Check the start time'});
            }

            if (new Date(endTime) <= new Date(startTime)) {
                // 날짜 형식맞는 지도 확인 필요
                return res.status(StatusCodes.BAD_REQUEST).json({message: 'Check the end time'});
            }

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

}
