import db from '@/database';
import { verifyToken } from "@/utils";
const { Profile } = db;

export const profileRepository = {
    findUserIdByToken: (token) => {
        const result = verifyToken(token);
        return result.user_id;
    },
    findByUserId: async (user_id) => {
        return await Profile.findOne({ where: { user_id } });
    },
    updateProfile: async (user_id, userData) => {
        return await Profile.update(userData, { where: { user_id } });
    }
}