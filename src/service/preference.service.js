import { preferenceRepository } from "@/repository";

export const preferenceService = {
    getPreferences: async (userId) => {
        try {
            const preference = await preferenceRepository.getPreferences(userId);
            return {
                neighborAlert: preference.neighborAlert,
                commentAlert: preference.commentAlert,
                chatAlert: preference.chatAlert,
                setNeighborPrivate: preference.setNeighborPrivate
            }
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
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
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}