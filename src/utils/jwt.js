import jwt from 'jsonwebtoken';
import { redisCli as redisClient } from '@/utils';

const storeToken = async (userId, accessToken, refreshToken) => {
    try {
        const tokens = JSON.stringify({ accessToken, refreshToken })
        await redisClient.hSet('tokens', userId, tokens);
        return true;
    } catch (error) {
        throw error;
    }
}

export const createToken = async (userId) => {
    const privateKey = process.env.PRIVATE_KEY;
    if (typeof(userId) === "number") {
        userId = userId.toString();
    }
    try {
        const accessToken = jwt.sign({ userId }, privateKey, {
            algorithm: "RS512",
            expiresIn: 1000 * 60 * 30
        });
        const refreshToken = jwt.sign({ userId }, privateKey, {
            algorithm: "RS512",
            expiresIn: "14d"
        });
        await storeToken(userId, accessToken, refreshToken);

        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
}

export const getTokens = async (userId) => {
    try {
        const tokens = await redisClient.hGetAll('tokens', userId);
        if (!tokens) {
            return false;
        }
        return JSON.parse(tokens[userId]);
    } catch (error) {
        throw error;
    }
}

export const verifyToken = (token) => {
    const publicKey = process.env.PUBLIC_KEY;
    try {
        return jwt.verify(token, publicKey);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { error: error.name };
        }
        throw { error };
    }
}