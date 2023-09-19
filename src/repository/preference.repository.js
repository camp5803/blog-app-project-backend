import db from '@/database';
const { Preference } = db;

export const preferenceRepository = {
    getPreferences: async (userId) => {
        return await Preference.findOne({
            where: { userId },
            attributes: [
                'setNeighborPrivate', 'neighborAlert', 
                'commentAlert', 'chatAlert'
            ]
        });
    },
    updatePreferences: async (userId, preferences) => {
        return await Preference.update(preferences, { where: { userId }});
    }
}