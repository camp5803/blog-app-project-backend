import { StatusCodes } from "http-status-codes";
import {discussionService} from "@/service/discussion.service";

export const validateDiscussionId = async (req, res, next) => {
    const discussion = await discussionService.validateDiscussionId(req.params.discussionId);

    if (!discussion) {
        return res.status(StatusCodes.NOT_FOUND).json({message: 'Non-existent discussion'});
    }

    next();
};