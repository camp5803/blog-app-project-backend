import { customError } from '@/common/error';
import { passwordRepository } from '@/repository';
import { createToken, getTokens, verifyToken } from '@/utils';
import { validateSchema, redisCli as redisClient } from '@/utils';
import { StatusCodes } from 'http-status-codes';
import bcrypt from "bcrypt";

export const authService = {
    login: async (email, password) => {
        try {
            await validateSchema.login.validateAsync({ email, password });
            const user = await passwordRepository.findByEmail(email);
            if (!user) {
                throw customError(StatusCodes.NOT_FOUND, "User not found.");
            }
            if (bcrypt.compareSync(password, user.password.dataValues.password)) {
                return await createToken(user.dataValues.userId);
            }
            throw customError(StatusCodes.CONFLICT, "Please check your email and password.");
        } catch (error) {
            if (error.name === "ValidationError") {
                throw customError(StatusCodes.BAD_REQUEST, 'Data validation failed.');
            }
            throw customError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    logout: async (userId) => {
        try {
            if (await redisClient.hGet("tokens", userId)) {
                await redisClient.hDel("tokens", userId);
            }
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR);
        }
    },
    reissueToken: async (accessToken, refreshToken) => {
        try {
            const payload = await verifyToken(refreshToken);
            if (payload.error === "TokenExpiredError") {
                return { message: "[Refresh Error#1] Refresh token expired." }
            }
            const tokens = await getTokens(payload.userId);
            if (!(tokens.accessToken === accessToken)) {
                return { message: "[Refresh Error#2] Refresh token is invalid." }
            }
            return await createToken(payload.userId);
        } catch (error) {
            throw customError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}