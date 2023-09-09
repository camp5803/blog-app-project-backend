import db from '@/database';
const { Preference } = db;

export const preferenceRepository = {
    getPreferences: async (userId) => {
        return await Preference.findOne({
            where: { user_id: userId },
            attributes: [
                ['darkmode_status', 'darkmode'],
                'neighbor_alert', 'comment_alert', 'chat_alert'
            ]
        });
    },
    updatePreferences: async (userId, preferences) => {
        return await Preference.update(preferences, { where: { user_id: userId }});
    }
}