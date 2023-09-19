import { neighborRepository, userRepository, blockRepository } from '@/repository';
import { customError } from '@/common/error';
import { StatusCodes } from 'http-status-codes';

export const neighborService = {
    getFollowers: async (userId) => {
        try {
            const data = await neighborRepository.findFollowersByUserId(userId);
            const followers = data.map(follower => {
                return {
                    userId: follower.userId,
                    nickname: follower.nickname,
                    imageUrl: follower.imageUrl
                }
            });
            return followers;
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    getFollowings: async (userId) => {
        try {
            const data = await neighborRepository.findFollowingsByUserId(userId);
            const followings = data.map(following => {
                return {
                    userId: following.userId,
                    nickname: following.nickname,
                    imageUrl: following.imageUrl
                }
            });
            return followings;
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    follow: async (userId, targetUserId) => {
        try {
            const user = await userRepository.findByUserId(targetUserId);
            const isFollowing = await neighborRepository.isFollowing(userId, targetUserId);
            if (!user || isFollowing) {
                if (!user) {
                    throw customError(StatusCodes.PRECONDITION_REQUIRED, "The user you are trying to follow does not exist.");
                }
                throw customError(StatusCodes.CONFLICT, "You're already a follower.");
            }
            return await neighborRepository.follow(userId, targetUserId);
        } catch (error) {
            throw customError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    unfollow: async (userId, targetUserId) => {
        try {
            const user = await userRepository.findByUserId(targetUserId);
            const isFollowing = await neighborRepository.isFollowing(userId, targetUserId);
            if (!user || !isFollowing) {
                if (!user) {
                    throw customError(StatusCodes.PRECONDITION_REQUIRED, "The user you are trying to unfollow does not exist.");
                }
                throw customError(StatusCodes.CONFLICT, "You are not already following the user.");
            }
            return await neighborRepository.unfollow(userId, targetUserId);
        } catch (error) {
            throw customError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    blockUser: async (userId, blockUserId) => {
        try {
            const user = await userRepository.findByUserId(blockUserId);
            const isBlocked = await blockRepository.isBlocked(userId, blockUserId);
            if (!user || isBlocked) {
                if (!user) {
                    throw customError(StatusCodes.PRECONDITION_REQUIRED, "The user you are trying to block does not exist.");
                }
                throw customError(StatusCodes.CONFLICT, "Already blocked user.");
            }
            const data = await blockRepository.block(userId, blockUserId);
            return data.dataValues.blockUserId;
        } catch (error) {
            throw customError(error.status || error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    getBlockUsers: async (userId) => {
        try {
            const data = await blockRepository.findBlockedUser(userId);
            const blockedUsers = data.map(block => {
                return {
                    userId: block.userId,
                    nickname: block.nickname,
                    imageUrl: block.imageUrl
                }
            });
            return blockedUsers;
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}