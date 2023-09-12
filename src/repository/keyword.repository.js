import db from '@/database';
const { Keyword, UserKeyword } = db;

export const keywordRepository = {
    findKeywordByName: async (keywordName) => {
        return await Keyword.findOne({ where: { keyword: keywordName } });
    },
    createKeyword: async (keywordName) => {
        return await Keyword.create({ keyword: keywordName });
    },
    associateKeywordToUser: async (userId, keywordId) => {
        const userKeyword = await UserKeyword.findOne({ where: { userId, keywordId }});
        if (userKeyword) {
            return { message: 'User already has this keyword' };
        }
        return await UserKeyword.create({ userId, keywordId });
    },
    dissociateKeywordFromUser: async (userId, keywordId) => {
        const userKeyword = await UserKeyword.findOne({ where: { userId, keywordId }});
        if (!userKeyword) {
            return { message: 'User does not have this keyword' };
        }
        return await userKeyword.destroy({ where: { userId, keywordId }});
    },
    findUserKeywords: async (userId) => {
        return await UserKeyword.findAll({ where: { userId },
            include: [{ model: Keyword, attribute: 'keyword' }]
        });
    }
}