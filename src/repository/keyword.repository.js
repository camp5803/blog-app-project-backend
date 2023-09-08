import db from '@/database';
const { Keyword, UserKeyword } = db;

export const keywordRepository = {
    findKeywordByName: async (keywordName) => {
        return await Keyword.findOne({ where: { keyword: keywordName } });
    },
    createKeyword: async (keywordName) => {
        return await Keyword.create({ keyword: keywordName });
    },
    associateKeywordToUser: async (keywordId, userId) => {
        const userKeyword = await UserKeyword.findOne({ where: { userId, keywordId }});
        if (userKeyword) {
            return { message: 'User already has this keyword' };
        }
        return await UserKeyword.create({ user_id: userId, keyword_id: keywordId });
    },
    dissociateKeywordFromUser: async (keywordId, userId) => {
        const userKeyword = await UserKeyword.findOne({ where: { userId, keywordId }});
        if (!userKeyword) {
            return { message: 'User does not have this keyword' };
        }
        return await userKeyword.destroy({ where: { user_id: userId, keyword_id: keywordId }});
    },
    findUserKeywords: async (userId) => {
        return await UserKeyword.findAll({ where: { user_id: userId },
            include: [{ model: Keyword, attribute: 'keyword' }]
        });
    }
}