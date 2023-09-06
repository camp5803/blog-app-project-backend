import { userRepository, profileRepository } from '@/repository';

export const userService = {
    isEmailExists: async (email) => {
        try {
            const user = await userRepository.findByEmail(email);
            if (user) {
                return { message: "Email Already exists." }
            }
            return { OK: true };
        } catch (error) {
            return { message: error }
        }
    },
    getUserInformation: async (accessToken) => {
        try {
            const userId = profileRepository.findUserIdByToken(accessToken);
            const userData = await profileRepository.findUserInformationById(userId);
            return userData.dataValues;
        } catch (error) {
            return { message: error.message };
        }
    },
    createUser: async (data) => {
        try {
            const user = await userRepository.findByEmail(data.email);
            if (user) {
                return { message: "[Signup Error#1] Email Already exists." }
            }
            return await userRepository.createUser(data);
        } catch (error) {
            return { message: error.message }
        }
    },
    updateUser: async (userId, data) => {
        try {
            const user = await profileRepository.findByUserId(userId);
            const userData = user.dataValues;

            Object.keys(userData).forEach(key => {
                if (data[key]) {
                    userData[key] = data[key];
                }
            });

            return await profileRepository.updateProfile(userId, userData);
        } catch (error) {
            return { message: error }
        }
    },
    deleteUser: async (userId) => {
        try {
            const count = await userRepository.deleteUser(userId);
            if (count === 0) {
                return {
                    error: 404,
                    message: "[Withdrawal Error#1] User not found"
                }
            }
        } catch (error) {
            return {
                error: 500,
                message: "[Withdrawal Error#2] Delete query failed."
            }
        }
    }
}