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
            await preferenceRepository.updatePreferences(userId, data);
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    updateDarkmode: async (userId, value) => {
        try {
            await preferenceRepository.updatePreferences(userId, {
                darkmodeStatus: value
            });
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}