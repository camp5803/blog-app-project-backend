import { redisCli as redisClient } from '@/utils/index'

export const authRepository = {
    getRefreshToken: async (userId) => {
        return await redisClient.get(userId.toString());
    }
}