import { redisCli as redisClient } from '@/utils';

export const notificationService = {
    sendEvent: async (userId, message) => {
        const connection = await redisClient.hget("sse-connections", userId);
        if (connection) {
            connection.write(`data: ${JSON.stringify(message)}`);
            return true
        }
        return false
    }
}