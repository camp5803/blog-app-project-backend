import { profileRepository, userRepository } from '@/repository';

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
    isNicknameExists: async (nickname) => {
        try {
            const user = await userRepository.findByEmail(nickname);
            if (user) {
                return { message: "Nickname Already exists." }
            }
            return { OK: true };
        } catch (error) {
            return { message: error }
        }
},
    getUserInformation: async (accessToken) => {
        try {
            const userId = profileRepository.findUserIdByToken(accessToken);
            return await profileRepository.findUserInformationById(userId);
        } catch (error) {
            return { message: error.message };
        }
    },
    createUser: async (data) => {
        try {
            const email = await userRepository.findByEmail(data.email);
            const nickname = await userRepository.findByNickname(data.nickname);
            if (email || nickname) {
                return { message: email ? `[Signup Error#1] Email Already exists.`
                        : `[Signup Error#2] Nickname Already exists.` };
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