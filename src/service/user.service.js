import { profileRepository, userRepository } from '@/repository';
import { validateSchema } from '@/utils';

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
            await validateSchema.signUp.validateAsync(data);
            const email = await userRepository.findByEmail(data.email);
            const nickname = await userRepository.findByNickname(data.nickname);
            if (email || nickname) {
                return { message: email ? `[Signup Error#1] Email Already exists.`
                        : `[Signup Error#2] Nickname Already exists.` };
            }
            const user = await userRepository.createUser(data);
            return { user, token: await createToken(user.userId) }
        } catch (error) {
            if (error.name === "ValidationError") {
                const message = [];
                error.details.forEach(detail => {
                    message.push(detail.message);
                });

                return { name: "ValidationError", message }
            }
            return { message: error.message }
        }
    },
    updateUser: async (userId, data) => {
        try {
            const user = await profileRepository.findByUserId(userId);
            if (data.nickname) {
                await validateSchema.nickname.validateAsync(data.nickname);
                return await profileRepository.updateProfile(userId, {
                    nickname: data.nickname,
                    imageUrl: user.dataValues.imageUrl
                });
            }
            return await profileRepository.updateProfile(userId, {
                nickname: user.dataValues.nickname,
                imageUrl: data.imageUrl
            })
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