import db from '@/database';
import { verifyToken } from "@/utils";
const { Profile, Preference } = db;

export const profileRepository = {
    findUserIdByToken: (token) => {
        const result = verifyToken(token);
        return result.user_id;
    },
    findUserInformationById: async (userId) => {
        const profile = await Profile.findOne({
            where: { user_id: userId },
            attributes: ['nickname', 'image_url'],
        });
        const preference = await Preference.findOne({
            where: { user_id: userId },
            attributes: ['darkmode_status']
        });
        return {
            nickname: profile.dataValues.nickname,
            image_url: profile.dataValues.image_url || '',
            darkmode: preference.dataValues.darkmode_status ? 1 : 0
        }
    },
    findByUserId: async (userId) => {
        return await Profile.findOne({ where: { user_id: userId } });
    },
    updateProfile: async (userId, userData) => {
        return await Profile.update(userData, { where: { user_id: userId } });
    }
}