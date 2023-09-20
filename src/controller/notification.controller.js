import { redisCli as redisClient } from '@/utils';
import { asyncWrapper } from '@/common';
import { StatusCodes } from 'http-status-codes';

export const notificationController = {
    initialize: asyncWrapper(async (req, res) => {
        try {            
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            await redisClient.hset('sse-connections', req.user.userId, res);

            req.on('close', async () => {
                await redisClient.hdel('sse-connections', req.user.userId);
            })
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
        }
    })
}