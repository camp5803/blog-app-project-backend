import db from '@/database/index';
const { User, Preference, Profile, SocialLogin, sequelize } = db;

export const socialLoginRepository = {
    findBySocialId: async (socialId) => {
        return await SocialLogin.findOne({ where: { external_id : socialId }});
    },
    createSocialUser: async (data) => {
        const transaction = await sequelize.transaction();
        try {
            const user = await User.create({
                email: data.email || null,
                login_type: data.type
            }, { transaction });
            await SocialLogin.create({
                user_id : user.user_id,
                social_code: data.type,
                external_id: data.id
            }, { transaction });
            await Preference.create({
                user_id: user.user_id
            }, { transaction });
            await Profile.create({
                user_id: user.user_id,
                nickname: `${data.type}data.name`,
                image_url: data.profile_image_url || null
            }, { transaction });

            await transaction.commit();
            return user;
        } catch (error) {
            await transaction.rollback();
            return { error };
        }
    }
}