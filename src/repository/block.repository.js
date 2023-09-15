import db from '@/database';
const { User, Block } = db;

export const blockRepository = {
    isBlocked: async (userId, blockUserId) => {
        const user = await User.findOne({ where: { blockUserId }});
        const blockUser = await Block.findOne({ where: { userId, blockUserId }});
        if (!user || !blockUser) {
            if (!user) {
                return -1;
            } 
            return -2;
        }
        return false;
    },
    block: async (userId, blockUserId) => {
        return await Block.create({
            userId, blockUserId
        });
    }
}