import db from '@/database';
const { Block } = db;

export const blockRepository = {
    findByUserId: async () => {
        
    },
    block: async (userId, blockUserId) => {
        return await Block.create({
            userId, blockUserId
        });
    }
}