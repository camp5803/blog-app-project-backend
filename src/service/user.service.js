import { profileRepository, userRepository, passwordRepository } from '@/repository';
import { validateSchema, sendVerificationMail } from '@/utils';
import { redisCli as redisClient } from '@/utils';
import crypto from 'crypto';

const generateRandomString = (length) => {
    let result = '';
    const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < length; i++) {
        result += charset.charAt(crypto.randomInt(charset.length));
    }
    return result;
}

const generateRandomPassword = () => {
    let result = '';
    const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const specialCharset = "!@#$%^&*()";
    for (let i = 0; i < 6; i++) {
        result += charset.charAt(crypto.randomInt(charset.length));
    }
    for (let i = 0; i < 3; i++) {
        result += specialCharset.charAt(crypto.randomInt(specialCharset.length));
    }
    return result;
}

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
            if (error.name === "ValidationError") {
                const message = [];
                error.details.forEach(detail => {
                    message.push(detail.message);
                });

                return { name: "ValidationError", message }
            }
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
    },
    updatePassword: async (userId, password) => {
        try {
            await validateSchema.password.validateAsync(password);
            await passwordRepository.updatePassword(userId, password);
            return { OK: true }
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
    sendPasswordResetMail: async (email) => {
        try {
            const user = await userRepository.findByEmail(email);
            if (!user) {
                return { message: "No users match this email." }
            }
            const info = await sendVerificationMail(email, generateRandomString(6));
            if (info.error) {
                return { message: "Failed to send mail." }
            }
            return { OK: true }
        } catch (error) {
            return { message: error.message }
        }
    },
    verificationMailHandler: async (email, code) => {
        try {
            const result = await redisClient.get(email);
            const password = generateRandomPassword();
            if (result === code) {
                const user = await userRepository.findByEmail(email);
                const result = await passwordRepository.updatePassword(user.userId, password);
                if (result === 0) {
                    return { message: "Failed to reset password." }
                }
                return { OK: true, password }
            }
            return { message: "Authentication code does not match." }
        } catch (error) {
            return { message: error.message }
        }
    },
}