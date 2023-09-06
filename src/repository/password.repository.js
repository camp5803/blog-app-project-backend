import db from '@/database/index';

const { User, Password } = db;

export const passwordRepository = {
    findByEmail: async (email) => {
        return await User.findOne({ where: { email },
            attributes: ['user_id', 'email'],
            include: [{ model: Password, attribute: 'password' }]
        });
    },
    findByUserId: async (data) => {
        return await Password.findOne({ where: { user_id: data.user_id }});
    },
}