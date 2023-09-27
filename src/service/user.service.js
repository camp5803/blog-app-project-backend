import { profileRepository, userRepository, passwordRepository, blockRepository } from '@/repository';
import { validateSchema, sendVerificationMail, createToken, redisCli as redisClient, createPassword } from '@/utils';
import { customError } from '@/common/error';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';

const generateRandomString = (length) => {
    let result = '';
    const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < length; i++) {
        result += charset.charAt(crypto.randomInt(charset.length));
    }
    return result;
}

export const userService = {
    isEmailExists: async (email) => {
        try {
            await validateSchema.email.validateAsync(email);
            const user = await userRepository.findByEmail(email);
            if (user) {
                throw customError(StatusCodes.CONFLICT, "Email Already exists.");
            }
        } catch (error) {
            if (error.name === "ValidationError") {
                throw customError(StatusCodes.BAD_REQUEST, `Data validation failed.`);
            }
            throw customError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    isNicknameExists: async (nickname) => {
        try {
            await validateSchema.nickname.validateAsync(nickname)
            const user = await userRepository.findByNickname(nickname);
            if (user) {
                throw customError(StatusCodes.CONFLICT, "Nickname Already exists.");
            }
        } catch (error) {
            if (error.name === "ValidationError") {
                throw customError(StatusCodes.BAD_REQUEST, `Data validation failed.`);
            }
            throw customError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    getUserInformation: async (accessToken) => {
        try {
            const userId = profileRepository.findUserIdByToken(accessToken);
            return await profileRepository.findUserInformationById(userId);
        } catch (error) {
            throw customError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    createUser: async (data) => {
        try {
            await validateSchema.signUp.validateAsync(data);
            const email = await userRepository.findByEmail(data.email);
            const nickname = await userRepository.findByNickname(data.nickname);
            if (email || nickname) {
                throw customError(StatusCodes.CONFLICT, email ? `[Signup Error#1] Email Already exists.`
                        : `[Signup Error#2] Nickname Already exists.`);
            }
            const user = await userRepository.createUser(data);
            return {
                data: user,
                token: await createToken(user.userId) 
            }
        } catch (error) {
            if (error.name === "ValidationError") {
                throw customError(StatusCodes.BAD_REQUEST, `Data validation failed.`);
            }
            throw customError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    updateUser: async (userId, data) => {
        try {
            const user = await profileRepository.findByUserId(userId);
            if (data.nickname) {
                await validateSchema.nickname.validateAsync(data.nickname);
                await profileRepository.updateProfile(userId, {
                    nickname: data.nickname,
                    imageUrl: user.dataValues.imageUrl
                });
            } else {
                await profileRepository.updateProfile(userId, {
                    nickname: user.dataValues.nickname,
                    imageUrl: data.imageUrl
                });
            }
        } catch (error) {
            if (error.name === "ValidationError") {
                throw customError(StatusCodes.BAD_REQUEST, 'Data validation failed.');
            }
            throw customError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    deleteUser: async (userId) => {
        try {
            await userRepository.deleteUser(userId);
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    updatePassword: async (userId, password) => {
        try {
            await validateSchema.password.validateAsync(password);
            await passwordRepository.updatePassword(userId, createPassword(password));
        } catch (error) {
            if (error.name === "ValidationError") {
                throw customError(StatusCodes.BAD_REQUEST, "Data validation failed.");
            }
            throw customError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    sendPasswordResetMail: async (email) => {
        try {
            const user = await userRepository.findUserByEmail(email);
            if (!user || user.loginType !== 0) {
                if (!user) {
                    throw customError(StatusCodes.NOT_FOUND, "No users match this email");
                }
                throw customError(StatusCodes.BAD_REQUEST, "This feature is not available to social sign-up users.");
            }
            const profile = await profileRepository.findByUserId(user.userId);
            const info = await sendVerificationMail(email, profile.nickname, generateRandomString(6));
            if (info.error) {
                throw customError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to send mail.");
            }
        } catch (error) {
            throw customError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    checkVerification: async (email, code) => {
        try {
            const result = await redisClient.get(email);
            if (result === code) {
                return true;
            }
            return false
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, "Redis error");
        }
    },
    verificationMailHandler: async (email, code, password) => {
        try {
            const result = await redisClient.get(email);
            if (result === code) {
                const user = await userRepository.findUserByEmail(email);
                await passwordRepository.updatePassword(user.userId, createPassword(password));
                await redisClient.del(email);
                return password;
            }
            throw customError(StatusCodes.CONFLICT, "Authentication code does not match.");
        } catch (error) {
            throw customError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
}