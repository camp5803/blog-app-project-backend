import db from '@/database/index';

const { Password } = db;

export const passwordRepository = {
    findByUserId: async (data) => {
        const password = await Password.findOne({ where : { user_id: data.user_id }});
        return password;
    },
}