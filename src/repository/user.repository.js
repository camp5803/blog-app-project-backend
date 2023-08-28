import db from '@/database/index'
import { createPassword } from '../utils/security';
const { 
    User, Password, Profile, Preference, SoicalLogin, sequelize 
} = db;

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
    createUser: async (data, socialData = { type: "local" }) => {
        try {
            return await sequelize.transaction(async (transaction) => {
                const user = await User.create({
                    email: data.email,
                    login_type: socialData.type
                }, { transaction });

                if (socialData.type != "local") {
                    await socialLogin.create({
                        user_id: user.user.id,
                        social_code: socialData.code,
                        external_id: socialData.id
                    }, { transaction });
                } else {
                    await Password.create({
                        user_id: user.user_id,
                        password: createPassword(data.password)
                    }, { transaction });
                }

                await Preference.create({
                    user_id: user.user_id
                }, { transaction });

                return await Profile.create({
                    user_id: user.user_id,
                    nickname: data.nickname
                }, { transaction });
            });
        } catch (e) {
            return {
                error: true,
                message: '[Signup Error#2] Transaction failed.'
            }
        }
        
    },
    deleteUser: async (user_id) => {
        return await User.destroy({ where : { user_id: user_id }});
    }
}