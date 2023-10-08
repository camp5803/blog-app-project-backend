import db from '@/database';
const { User, Block, Profile } = db;

export const blockRepository = {
    isBlocked: async (userId, blockUserId) => {
        return await Block.findOne({ where: { userId, blockUserId }});
    },
    block: async (userId, blockUserId) => {
        return await Block.create({
            userId, blockUserId
        });
    },
    findBlockedUser: async (userId) => {
        return await Block.findAll({
            where: { userId },
            attribute: "blockUserId" 
        })
    }
}