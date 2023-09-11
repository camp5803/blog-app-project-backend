import { customError } from "@/common/error";
import { keywordRepository } from "@/repository";
import { validateSchema } from '@/utils';
import { StatusCodes } from 'http-status-codes';

export const keywordService = {
    getUserKeywords: async (userId) => {
        try {
            return await keywordRepository.findUserKeywords(userId);
        } catch (error) {
            console.error(error.stack);
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    createUserKeyword: async (userId, keywordName) => {
        try {
            const validated = await validateSchema.keyword.validateAsync(keywordName);
            const keyword = await keywordRepository.findKeywordByName(validated.value);
            if (!keyword) {
                const newKeyword = await keywordRepository.createKeyword(validated.value);
                return await keywordRepository.associateKeywordToUser(userId, newKeyword.dataValues.keywordId);
            }
            return await keywordRepository.associateKeywordToUser(userId, keyword.dataValues.keywordId);
        } catch (error) {
            if (error.name === "ValidationError") {
                throw customError(StatusCodes.BAD_REQUEST, error.details[0].message);
            }
            console.error(error.stack);
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    dissociateKeywordFromUser: async (userId, keywordName) => {
        try {
            const keyword = keywordRepository.findKeywordByName(keywordName);
            await keywordRepository.dissociateKeywordFromUser(keyword.dataValues.keywordId, userId);
        } catch (error) {
            console.error(error.stack);
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}