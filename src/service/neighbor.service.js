import { neighborRepository } from '@/repository';

export const userService = {
    getFollowers: async (userId) => {
        try {
            const data = await neighborRepository.findFollowersByUserId(userId);
            const followers = [];

            data.forEach(follower => {
                followers.push({
                    userId: follower.userId,
                    nickname: follower.Profile.nickname,
                    imageUrl: follower.Profile.imageUrl
                });
            });
            
            return followers;
        } catch (error) {
            console.error(error.stack);
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
    getFollowings: async (userId) => {
        try {
            const data = await neighborRepository.findFollowingsByUserId(userId);
            const followings = [];

            data.forEach(follower => {
                followings.push({
                    userId: follower.userId,
                    nickname: follower.Profile.nickname,
                    imageUrl: follower.Profile.imageUrl
                });
            });
            
            return followings;
        } catch (error) {
            console.error(error.stack);
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}