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
    image_url: {
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
        login_type: socialCode[type],
    }, { transaction });
};

const createSocialLoginRecord = async (userId, data, type, transaction) => {
    const externalId = formatData('id', type, data);
    return await SocialLogin.create({
        user_id : userId,
        social_code: socialCode[type],
        external_id: typeof(externalId) === "number"? externalId.toString() : externalId,
    }, { transaction });
}

const createPreferenceRecord = async (userId, transaction) => {
    return await Preference.create({
        user_id: userId
    }, { transaction });
};

const createProfileRecord = async (userId, data, type, transaction) => {
    const name = formatData('name', type, data);
    return await Profile.create({
        user_id: userId,
        nickname: `${type}${name}`,
        image_url: formatData('image_url', type, data),
    }, { transaction });
};

export const socialLoginRepository = {
    findBySocialId: async (socialId) => {
        return await SocialLogin.findOne({ where: { external_id : socialId }});
    },
    createSocialUser: async (data, type) => { // userRepository의 createUser 참조하여 만들기
        const transaction = await sequelize.transaction();
        try {
            const user = await createUserRecord(data, type, transaction);
            await Promise.all([
                createSocialLoginRecord(user.user_id, data, type, transaction),
                createPreferenceRecord(user.user_id, transaction),
                createProfileRecord(user.user_id, data, type, transaction)
            ]);
            await transaction.commit();
            return user;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
}