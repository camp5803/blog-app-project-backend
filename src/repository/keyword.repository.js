import db from '@/database';
import { fn, col, Op } from 'sequelize';
const { Keyword, UserKeyword } = db;

export const keywordRepository = {
    findKeywordByName: async (keywordName) => {
        return await Keyword.findOne({ where: { keyword: keywordName } });
    },
    createKeyword: async (keywordName) => {
        return await Keyword.create({ keyword: keywordName });
    },
    findTrendyKeyword: async () => {
        return await UserKeyword.findAll({
            attribute: 'keywordId',
            group: ['keywordId'],
            include: [{ model: Keyword, attribute: 'keyword' }],
            order: [[ fn('COUNT', col('keywordId')), 'DESC' ]],
            limit: 10
        });
    },
    searchKeywords: async (data) => {
        return await Keyword.findAll({
            where: {
                keyword: {
                    [Op.like]: `%${data}%`
                }
            },
            limit: 5
        });
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
            include: [{ model: Keyword, attribute: 'keyword' }],
            order: [['createdAt', 'DESC']],
            limit: 10
        });
    }
}

/* 
const result = await Post.findAll({
      attributes: [
        [sequelize.literal('bar'), 'barValue'],
        [sequelize.fn('COUNT', sequelize.col('bar')), 'count'],
      ],
      group: ['bar'],
      include: [
        {
          model: User,
          attributes: [],
        },
      ],
      order: [[sequelize.fn('COUNT', sequelize.col('bar')), 'DESC']],
      limit: 10,
    });
*/