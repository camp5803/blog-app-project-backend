import { userRepository } from '@/repository/index';
import { asyncWrapper } from '@/common/index';
import jwt from 'jsonwebtoken';

export const authService = {

    createLocal: async (userData) => {
    },

    createToken: asyncWrapper(async (user) => {
        const secret = process.env.PRIVATE_KEY;
        const accessToken = jwt.sign(user.toJSON(), secret, {
            expiresIn: '30m' 
        });
        const refreshToken = jwt.sign({}, secret, {
            algorithm: "RS512",
            expiresIn: "14d"
        });

        return { accessToken, refreshToken };
    }),
}