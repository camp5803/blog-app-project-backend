import jwt from 'jsonwebtoken';
import { authRepository } from '@/repository';
import { createToken, redisCli as redisClient } from '@/utils/index';

export const authService = {
    reissueToken: async (token) => { 
        const privateKey = process.env.PRIVATE_KEY;
        const payload = jwt.decode(token);

        const refreshToken = await authRepository.getRefreshToken(payload.user_id);
        if (refreshToken === null) {
            return {
                error: true,
                message: "[Refresh Error#1] Refresh token expired."
            }
        }
        
        const accessToken = jwt.sign({ user_id: payload.user_id }, privateKey, {
            algorithm: "RS512",
            expiresIn: '30m'
        });

        return accessToken;
    },
    createToken: async (user) => {
        try {
            const token = createToken(user);
            const result = await redisClient.set(user.user_id.toString(), token.refreshToken, "EX", 1209600); // 14d
            if (result.error) {
                return {
                    error: true,
                    message: "[Login Failed #4] ".concat(result.error) ,
                }
            }
            return token;
        } catch (e) {
            return {
                error: true,
                message: "[Login Failed #5] Token creation failed.",
            }
        }
    }
}