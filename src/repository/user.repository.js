import db from '@/database';
import { createPassword } from '@/utils';
const { 
    User, Password, Profile, Preference, sequelize
} = db;

export const userRepository = {
    findByUserId: async (data) => {
        return await User.findOne({ where: { user_id: data }});
    },
    findByEmail: async (email) => {
        return await User.findOne({ where: { email }});
    },
    createUser: async (data) => { // 유저 데이터 그대로 믿으면 안됨
        try {
            return await sequelize.transaction(async (transaction) => {
                const user = await User.create({
                    email: data.email,
                    login_type: "local"
                }, { transaction });

                await Password.create({
                    user_id: user.user_id,
                    password: createPassword(data.password)
                }, { transaction });

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