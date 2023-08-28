import { createClient } from 'redis';

const redisClient = createClient({ 
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
    legacyMode: true 
});
redisClient.on('connect', () => {
    console.log("Redis connected");
});
redisClient.on('error', (err) => {
    console.error('Redis connect Error', err);
});

redisClient.connect().then();

const redisCli = redisClient.v4;

export default redisCli;