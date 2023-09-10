import db from '@/database';

const { User, Password } = db;

export const passwordRepository = {
    findByEmail: async (email) => {
        return await User.findOne({ where: { email },
            attributes: ['userId', 'email'],
            include: [{ model: Password, attribute: 'password' }]
        });
    },
    findByUserId: async (data) => {
        return await Password.findOne({ where: { userId: data.user_id }});
    },
}