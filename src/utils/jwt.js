import jwt from 'jsonwebtoken';
import { redisCli as redisClient } from '@/utils/index';

export default async (user_id) => {
    const privateKey = process.env.PRIVATE_KEY;
    try {
        const accessToken = jwt.sign({ user_id }, privateKey, {
            algorithm: "RS512",
            expiresIn: '30m' 
        });
        const refreshToken = jwt.sign({}, privateKey, {
            algorithm: "RS512",
            expiresIn: "14d"
        });
        if (typeof(user_id) === "number") {
            user_id = user_id.toString();
        }
        const result = await redisClient.set(user_id, refreshToken, "EX", 1209600); // 14d
        if (result.error) {
            return {
                error: true,
                message: "[Login Failed #4] ".concat(result.error) ,
            }
        }
        return { accessToken, refreshToken };
    } catch (error) {
        return { error };
    }
}