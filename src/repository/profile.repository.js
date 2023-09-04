import db from '@/database';
const { Profile } = db;

export const profileRepository = {
    findByUserId: async (user_id) => {
        return await Profile.findOne({ where: { user_id } });
    },
    updateProfile: async (user_id, userData) => {
        return await Profile.update(userData, { where: { user_id } });
    }
}