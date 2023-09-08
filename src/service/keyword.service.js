import { keywordRepository } from "@/repository";

export const keywordService = {
    getMyKeywords: async (userId) => {
        try {
            return await keywordRepository.findUserKeywords(userId);
        } catch (error) {
            return { message: error.message }
        }
    },
    createUserKeyword: async (userId, keyword) => {
        try {
            const newKeyword = await keywordRepository.createKeyword(keyword);
            return await keywordRepository.associateKeywordToUser(userId, newKeyword.dataValues.keyword_id);
        } catch (error) {
            return { message: error.message }
        }
    },
    dissociateKeywordFromUser: async (userId, keywordId) => {
        try {
            return await keywordRepository.dissociateKeywordFromUser(userId, keywordId);
        } catch (error) {
            return { message: error.message }
        }
    }
}