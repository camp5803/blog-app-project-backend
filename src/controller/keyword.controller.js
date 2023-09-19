import { asyncWrapper } from '@/common';
import { StatusCodes } from 'http-status-codes';
import { keywordService } from '@/service';
import { customError } from '@/common/error';

export const keywordController = {
    getKeywords: asyncWrapper(async (req, res) => {
        if (req.user) {
            const keywords = await keywordService.getUserKeywords(req.user.userId);
            return res.status(StatusCodes.OK).json(keywords);
        }
        const keywords = await keywordService.getTrendyKeywords();
        return res.status(StatusCodes.OK).json(keywords);
    }),
    createMyKeyword: asyncWrapper(async (req, res) => {
        if (!req.body.keyword) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
        }
        await keywordService.createUserKeyword(req.user.userId, req.body.keyword);
        return res.status(StatusCodes.CREATED).end();
    }),
    dissociateMyKeyword: asyncWrapper(async (req, res) => {
        if (!req.body.keyword) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
        }
        await keywordService.dissociateKeywordFromUser(req.user.userId, req.body.keyword);
        return res.status(StatusCodes.OK).end();
    }),
}