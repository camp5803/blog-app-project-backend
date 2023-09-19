import db from '@/database';
import { createPassword } from '@/utils';
const { 
    User, Password, Profile, Preference, sequelize
} = db;

const createUserRecord = async (data, transaction) => {
    return await User.create({
        email: data.email,
        loginType: 0
    }, { transaction });
};

const createPasswordRecord = async (userId, password, transaction) => {
    return await Password.create({
        userId,
        password: createPassword(password)
    }, { transaction });
};

const createPreferenceRecord = async (userId, transaction) => {
    return await Preference.create({
        userId
    }, { transaction });
};

const createProfileRecord = async (userId, nickname, transaction) => {
    return await Profile.create({
        userId, nickname
    }, { transaction });
};

export const userRepository = {
    findByUserId: async (userId) => {
        return await User.findOne({ where: { userId }});
    },
    findEmailByUserId: async (userId) => {
        return await User.findOne({
            where: { userId },
            attributes: ['email']
        });
    },
    findByEmail: async (email) => {
        return await User.findOne({
            where: { email },
            attributes: ['email']
        });
    },
    findUserByEmail: async (email) => {
        return await User.findOne({
            where: { email }
        });
    },
    findByNickname: async (nickname) => {
        return await Profile.findOne({
            where: { nickname },
            attributes: ['nickname']
        });
    },
    createUser: async (data) => {
        const transaction = await sequelize.transaction();
        try {
            const user = await createUserRecord(data, transaction);
            await Promise.all([
                createPasswordRecord(user.dataValues.userId, data.password, transaction),
                createPreferenceRecord(user.dataValues.userId, transaction),
                createProfileRecord(user.dataValues.userId, data.nickname, transaction)
            ])

            await transaction.commit();
            return user.dataValues;
        } catch (error) {
            await transaction.rollback();
            return error;
        }
    },
    deleteUser: async (userId) => {
        return await User.destroy({ where: { userId }});
    }
}