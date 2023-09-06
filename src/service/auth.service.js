import jwt from 'jsonwebtoken';
import { authRepository, passwordRepository } from '@/repository';
import {createToken, getTokens, verifyToken} from '@/utils';
import bcrypt from "bcrypt";

export const authService = {
    login: async (email, password) => {
        try {
            const user = await passwordRepository.findByEmail(email);
            if (!user) {
                return { message: "[Login Failed #2] Please check your email and password." }
            }
            if (bcrypt.compareSync(password, user.password.dataValues.password)) {
                return await createToken(user.dataValues.user_id);
            }
            return { message: "[Login Failed #1] Please check your email and password." }
        } catch (error) {
            return { message: error.message }
        }
    },
    reissueToken: async (accessToken, refreshToken) => {
        try {
            const payload = await verifyToken(refreshToken);
            if (payload.error === "TokenExpiredError") {
                return { message: "[Refresh Error#1] Refresh token expired." }
            }
            const tokens = await getTokens(payload.user_id);
            if (!(tokens.accessToken === accessToken)) {
                return { message: "[Refresh Error#2] Refresh token is invalid." }
            }
            return await createToken(payload.user_id);
        } catch (error) {
            return { message: error.message }
        }
    }
}