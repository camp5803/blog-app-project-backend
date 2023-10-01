import db from '@/database/index';
const { User, Preference, Profile, SocialLogin, sequelize } = db;

const socialCode = {
    KAKAO: 1,
    GITHUB: 2,
    GOOGLE: 3
}

const typeFormatters = {
    email: {
        KAKAO: (data) => data.kakao_account.email,
        default: (data) => data.email,
    },
    name: {
        KAKAO: (data) => data.kakao_account.profile.nickname,
        default: (data) => data.name,
    },
    id: (data) => data.id,
    imageUrl: {
        KAKAO: (data) => data.kakao_account.profile.image_url,
        GITHUB: (data) => data.avatar_url,
        default: (data) => data.picture,
    },
};

const formatData = (type, provider, data) => {
    const formatter = typeFormatters[type] && (typeFormatters[type][provider] || typeFormatters[type].default);
    return formatter ? formatter(data) : null;
};

const createUserRecord = async (data, type, transaction) => {
    return await User.create({
        email: formatData('email', type, data) || null,
        loginType: socialCode[type],
    }, { transaction });
};

const createSocialLoginRecord = async (userId, data, type, transaction) => {
    return await SocialLogin.create({
        userId,
        socialCode: socialCode[type],
        externalId: typeof(data.id) === "number" ? data.id.toString() : data.id,
    }, { transaction });
}

const createPreferenceRecord = async (userId, transaction) => {
    return await Preference.create({
        userId
    }, { transaction });
};

const createProfileRecord = async (userId, data, type, transaction) => {
    const name = formatData('name', type, data);
    return await Profile.create({
        userId,
        nickname: `${type.toUpperCase()}_${name}`,
        imageUrl: formatData('imageUrl', type, data),
    }, { transaction });
};

export const socialLoginRepository = {
    findBySocialId: async (socialId) => {
        return await SocialLogin.findOne({ where: { externalId : socialId }});
    },
    createSocialUser: async (data, type) => { // userRepository의 createUser 참조하여 만들기
        const transaction = await sequelize.transaction();
        try {
            const user = await createUserRecord(data, type, transaction);
            await Promise.all([
                createSocialLoginRecord(user.userId, data, type, transaction),
                createPreferenceRecord(user.userId, transaction),
                createProfileRecord(user.userId, data, type, transaction)
            ]);
            await transaction.commit();
            return user;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
}