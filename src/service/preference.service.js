import { preferenceRepository } from "@/repository";
import { validateSchema } from '@/utils';

export const preferenceService = {
    getPreferences: async (userId) => {
        try {
            return await preferenceRepository.getPreferences(userId);
        } catch (error) {
            return { message: error }
        }
    },
    updatePreferences: async (userId, data) => {
        try {
            const preference = await preferenceRepository.getPreferences(userId);
            const preferenceData = preference.dataValues;

            Object.keys(preferenceData).forEach(key => {
                if (data[key]) {
                    preferenceData[key] = data[key];
                }
            });

            return await preferenceRepository.updatePreferences(userId, preferenceData);
        } catch (error) {
            return { message: error }
        }
    }
}