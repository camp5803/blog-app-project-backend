import jwt from 'jsonwebtoken';
import { authRepository } from '@/repository';
import { createToken } from '@/utils/index';

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
    createToken: async (user_id) => {
        const token = await createToken(user_id);
        if (token.error) {
            return {
                error: true,
                message: token.message,
            }
        }
        return token;
    }
}