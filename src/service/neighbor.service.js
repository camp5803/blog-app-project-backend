import { neighborRepository, userRepository, blockRepository, profileRepository } from '@/repository';
import { customError } from '@/common/error';
import { StatusCodes } from 'http-status-codes';

export const neighborService = {
    getFollowers: async (userId) => {
        try {
            const followerIds = await neighborRepository.findFollowersUserIds(userId);
            if (followerIds?.length === 0) {
                throw customError(StatusCodes.NOT_FOUND, `No posts`);
            }
            const userIds = followerIds.map(follower => follower.userId);
            return await neighborRepository.findProfileByUserIds(userIds);
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    getFollowings: async (userId) => {
        try {
            const followingIds = await neighborRepository.findFollowingUserIds(userId);
            if (followingIds?.length === 0) {
                throw customError(StatusCodes.NOT_FOUND, `No posts`);
            }
            const userIds = followingIds.map(following => following.userId);
            return await neighborRepository.findProfileByUserIds(userIds);
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    getNeighborsCounts: async (userId) => {
        try {
            return await neighborRepository.findNeighborCounts(userId);
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
    unBlockUser: async (userId, blockUserId) => {
        try {
            const isBlocked = await blockRepository.isBlocked(userId, blockUserId);
            if (!isBlocked) {
                throw customError(StatusCodes.CONFLICT, "Already not blocked user.");
            }
            const data = await blockRepository.unBlock(userId, blockUserId);
            return data.dataValues.blockUserId;
        } catch (error) {
            throw customError(error.status || error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    getBlockUsers: async (userId) => {
        try {
            const blockUserIds = await blockRepository.findBlockedUser(userId);
            const blockUserProfile = await profileRepository.findUsersInformationById(blockUserIds.map(b => b.blockUserId));
            return blockUserProfile.map(b => {
                return {
                    userId: b.userId,
                    nickname: b.nickname,
                    imageUrl: b.imageUrl,
                }
            })
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}