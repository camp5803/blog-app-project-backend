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
    getUserDiscussionKeyword: async (userId) => {
        try {
            const keywords = new Map();
            const data = await discussionRepository.getDiscussionByUserId(userId);
            if (data?.length === 0) {
                throw customError(StatusCodes.NOT_FOUND, `No discussions`);
            }
            const discussionIds = data.map(d => d.discussionId);
            const categories = await discussionRepository.getDiscussionCategory(discussionIds);
            const discussionCategories = data.map(d => {
                return {
                    discussionId: d.discussionId,
                    elapsedTime: d.elapsedTime,
                    category: categories.filter(c => c.discussionId === d.discussionId).map(c => c.category)
                }
            });
            categories.forEach(c => {
                c.category.forEach(keyword => {
                    keywords.set(keyword, 0);
                })
            });
            discussionCategories.forEach(dc => {
                dc.category.forEach(c => {
                    keywords.set(c, keywords.get(c) + dc.elapsedTime);
                });
            });
            return Array.from(keywords.entries()).map(k => {
                return {
                    keyword: k[0],
                    time: {
                        hours: Math.round(k[1] / 3600),
                        minutes: Math.round(k[1] % 3600)
                    }
                }
            });
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
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