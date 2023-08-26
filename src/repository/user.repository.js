import { db } from '@/database/index'
import { asyncWrapper } from '@/common/index';
import { createPassword } from '../utils/security';
const { User, Password, Profile, sequelize } = db;

export const userRepository = {
    findByPassword: async (data) => {
        const user = await User.findOne({ where: { email: data.email }});
        const password = await Password.fineOne({ where : { user_id: user.user_id, password: createPassword(data.password) }});

        if (password) {
            return user;
        }
        return null;
    },
    findByUserId: async (data) => {
        return await User.findOne({ where: { user_id: data.userId }});
    },
    findByEmail: async (email) => {
        return await User.findOne({ where: { email }});
    },
    createUser: async (data) => {
        return await sequelize.transaction(async (transaction) => {
            const user = await User.create({
                email: data.email,
                login_type: data.login_type
            });
            return await Profile.create({
                user_id: user.user_id,
                nickname: data.nickname
            });
        });
    }
}