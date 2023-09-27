import {authService} from "@/service/auth.service";
import {socketRepository} from '@/repository/socket.repository';
import {verifyToken, redisCli as redisClient} from "@/utils";
import db from '@/database/index';

const cookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'None',
}

if (process.env.SECURE_ENABLED) {
    cookieOptions.secure = true;
}

export const socketService = {
    verifyUser: async (socket) => {

        const {cookie} = socket.handshake.headers;

        if (!cookie) {
            return {error: '비로그인 유저'};
        }

        const accessToken = cookie.split(';')[0].split('=')[1];
        const refreshToken = cookie.split(';')[1].split('=')[1];
        if (!accessToken) {
            return {error: '[Token Error#1] No token'};
        }

        const verifyResult = verifyToken(accessToken);
        if (verifyResult.error) {
            if (verifyResult.error === "TokenExpiredError") {
                const newToken = await authService.reissueToken(
                    accessToken, refreshToken
                );
                // res.cookie('accessToken', newToken.accessToken, cookieOptions);
                // res.cookie('refreshToken', newToken.refreshToken, cookieOptions);
                const user = verifyToken(newToken.accessToken);
                return user.userId;
            }
            return {error: "[Token Error#2] Invalid access token."};
        }

        const userId = verifyResult.userId;
        const nickname = await socketRepository.getUserNickname(userId);

        return {
            userId,
            nickname,
            // 아래 정보는 room마다 필요한건데
            // status: true,
            // lastConnection: new Date(),
        };
    },

    checkDiscussionUser: async (discussionId, userId) => {
        const transaction = await db.sequelize.transaction();
        const result = {};

        try {
            // 이미 존재하는지 확인
            const discussionUser = await socketRepository.getDiscussionUser(discussionId, userId, transaction);

            // 강퇴 유저인지
            if (discussionUser && discussionUser.isBanned) {
                result.error = 'Banned user';
            }

            // 없으면 새로 추가
            if (!discussionUser) {
                await socketRepository.createDiscussionUser(discussionId, userId, transaction);
            }

            await transaction.commit();
            return result;
        } catch (error) {
            await transaction.rollback();
            throw new Error(error);
        }
    },

    getDiscussionUsers: async (discussionId) => {
        const transaction = await db.sequelize.transaction();
        const result = {
            user: [],
            bannedUser: []
        };

        try {
            const discussionUsers = await socketRepository.getDiscussionUsers(discussionId, transaction);
            discussionUsers.forEach(user =>{
                user.isBanned ? result.bannedUser.push(user) : result.user.push(user);
            })

            await transaction.commit();
            return result;
        } catch (error) {
            await transaction.rollback();
            throw new Error(error);
        }
    },

    validateDiscussionId: async (discussionId) => {
        const transaction = await db.sequelize.transaction();

        try {
            const discussion = await socketRepository.getDiscussionById(discussionId, transaction);

            await transaction.commit();
            return !!discussion;
        } catch (error) {
            await transaction.rollback();
            throw new Error(error);
        }
    },
}