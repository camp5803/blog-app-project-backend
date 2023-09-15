import { customError } from "@/common/error";
import { keywordRepository } from "@/repository";
import { validateSchema } from '@/utils';
import { StatusCodes } from 'http-status-codes';

export const keywordService = {
    getUserKeywords: async (userId) => {
        try {
            const keywords = await keywordRepository.findUserKeywords(userId);
            return keywords.map(k => {
                return { 
                    keywordId: k.keyword.keywordId,
                    keyword: k.keyword.keyword 
                }
            });
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    getTrendyKeywords: async () => {
        try {
            const keywords = await keywordRepository.findTrendyKeyword();
            return keywords.map(k => {
                return {
                    keywordId: k.keyword.keywordId,
                    keyword : k.keyword.keyword
                }
            });
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    createUserKeyword: async (userId, keywordName) => {
        try {
            await validateSchema.keyword.validateAsync(keywordName);
            const keyword = await keywordRepository.findKeywordByName(keywordName);
            if (!keyword) {
                const newKeyword = await keywordRepository.createKeyword(keywordName);
                return await keywordRepository.associateKeywordToUser(userId, newKeyword.dataValues.keywordId);
            }
            return await keywordRepository.associateKeywordToUser(userId, keyword.dataValues.keywordId);
        } catch (error) {
            if (error.name === "ValidationError") {
                throw customError(StatusCodes.BAD_REQUEST, error.details[0].message);
            }
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    dissociateKeywordFromUser: async (userId, keywordName) => {
        try {
            if (keywordName === undefined) {
                throw customError(StatusCodes.UNPROCESSABLE_ENTITY, "Keyword not received.");
            }
            const keyword = await keywordRepository.findKeywordByName(keywordName);
            if (keyword.dataValues === null) {
                throw customError(StatusCodes.PRECONDITION_REQUIRED, "This keyword does not exist.");
            }
            await keywordRepository.dissociateKeywordFromUser(userId, keyword.dataValues.keywordId);
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}