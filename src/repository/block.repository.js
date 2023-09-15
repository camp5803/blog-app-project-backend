import db from '@/database';
const { User, Block } = db;

export const blockRepository = {
    findByUserIdAndBlockUserId: async (userId, blockUserId) => {
        return await User.findOne({
            where: { userId: blockUserId },
            include: [{
                model: Block,
                where: { userId, blockUserId },
                required: false
            }]
        });
    },
    block: async (userId, blockUserId) => {
        return await Block.create({
            userId, blockUserId
        });
    }
}