import db from '@/database';
import { verifyToken } from "@/utils";
const { Profile, Preference } = db;

export const profileRepository = {
    findUserIdByToken: (token) => {
        const result = verifyToken(token);
        return result.userId;
    },
    findUserInformationById: async (userId) => {
        const profile = await Profile.findOne({
            where: { userId },
            attributes: ['nickname', 'imageUrl'],
        });
        const preference = await Preference.findOne({
            where: { user_id: userId },
            attributes: ['darkmodeStatus']
        });
        return {
            nickname: profile.dataValues.nickname,
            imageUrl: profile.dataValues.imageUrl || '',
            darkmode: preference.dataValues.darkmodeStatus ? 1 : 0
        }
    },
    findByUserId: async (userId) => {
        return await Profile.findOne({ where: { userId } });
    },
    updateProfile: async (userId, userData) => {
        return await Profile.update(userData, { where: { userId } });
    }
}