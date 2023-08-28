import db from '@/database/index';
const { User, SocialLogin, sequelize } = db;

export const socialLoginRepository = {
    findBySocialId: async (socialId) => {
        return await SocialLogin.findOne({ where: { social_id : socialId }});
    }
}