import { customError } from "@/common/error";
import { discussionRepository, keywordRepository } from "@/repository";
import { validateSchema } from '@/utils';
import { StatusCodes } from 'http-status-codes';

export const keywordService = {
    getUserKeywords: async (userId) => {
        try {
            const keywords = await keywordRepository.findUserKeywords(userId);
            return keywords.map(k => {
                return { 
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
                    keyword : k.keyword.keyword
                }
            });
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    // getUserDiscussionKeyword: async (userId) => {
    //     const keywords = new Set();
    //     const data = await discussionRepository.getDiscussionByUserId(userId);
    //     const discussions = data.map(d => d.discussion);
    //     const categories = await discussionRepository.getDiscussionCategory(
    //         discussions.map(
    //             d => d.discussionId));
        
    //     categories.forEach(c => {
    //         keywords.add(c.category);
    //     });
    //     for (let k of keywords.values()) {
    //         const ids = categories.filter(c => c.category === k).map(c => c.discussionId);
    //         ids.forEach(id => {
    //             discussions.filter(d => d.discussionId === id).map(d => d.spendTime);
    //         })
    //     }
    // },
    highlightKeywords: async (data) => {
        try {
            const result = await keywordRepository.searchKeywords(data);
            return result.map(k => k.keyword);
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    highlightMyKeywords: async (data) => {
        try {
            const result = await keywordRepository.searchKeywords(data);
            return result.map(k => k.keyword);
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
            const keyword = await keywordRepository.findKeywordByName(keywordName);
            if (keyword === null) {
                throw customError(StatusCodes.PRECONDITION_REQUIRED, "This keyword does not exist.");
            }
            await keywordRepository.dissociateKeywordFromUser(userId, keyword.dataValues.keywordId);
        } catch (error) {
            throw customError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}