import db from '@/database';
import { verifyToken } from "@/utils";
const { Profile, Preference } = db;

export const profileRepository = {
    findUserIdByToken: (token) => {
        const result = verifyToken(token);
        return result.user_id;
    },
    findUserInformationById: async (user_id) => {
        return await Profile.findOne({
            where: { user_id },
            attributes: ['nickname', 'image_url'],
            include: [ { model: Preference, attributes: ['darkmode_status'] }]
        });
    },
    findByUserId: async (user_id) => {
        return await Profile.findOne({ where: { user_id } });
    },
    updateProfile: async (user_id, userData) => {
        return await Profile.update(userData, { where: { user_id } });
    }
}