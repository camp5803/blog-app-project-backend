import db from '@/database';
import { createPassword } from '@/utils';
const { 
    User, Password, Profile, Preference, sequelize
} = db;

const createUserRecord = async (data, transaction) => {
    return await User.create({
        email: data.email,
        login_type: 0
    }, { transaction });
};

const createPasswordRecord = async (userId, password, transaction) => {
    return await Password.create({
        user_id: userId,
        password: createPassword(password)
    }, { transaction });
};

const createPreferenceRecord = async (userId, transaction) => {
    return await Preference.create({
        user_id: userId
    }, { transaction });
};

const createProfileRecord = async (userId, nickname, transaction) => {
    return await Profile.create({
        user_id: userId,
        nickname
    }, { transaction });
};

export const userRepository = {
    findEmailByUserId: async (userId) => {
        return await User.findOne({
            where: { user_id: userId },
            attributes: ['email']
        });
    },
    findByEmail: async (email) => {
        return await User.findOne({
            where: { email },
            attributes: ['email']
        });
    },
    findByNickname: async (nickname) => {
        return await Profile.findOne({
            where: { nickname },
            attributes: ['nickname']
        });
    },
    createUser: async (data) => { // 어케수정하지 고민됨
        const transaction = await sequelize.transaction();
        try {
            const user = await createUserRecord(data, transaction);
            await Promise.all([
                createPasswordRecord(user.dataValues.user_id, data.password, transaction),
                createPreferenceRecord(user.dataValues.user_id, transaction),
                createProfileRecord(user.dataValues.user_id, data.nickname, transaction)
            ])

            await transaction.commit();
            return user;
        } catch (error) {
            await transaction.rollback();
            return error;
        }
    },
    deleteUser: async (userId) => {
        return await User.destroy({ where : { user_id: userId }});
    }
}