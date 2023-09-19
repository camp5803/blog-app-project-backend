import {discussionRepository} from '@/repository/discussion.repository';
import {verifyToken, redisCli as redisClient} from "@/utils";

export const discussionService = {
    createDiscussion: async (dto) => {
        try {
            dto.view = 0;
            dto.like = 0;

            const discussion = await discussionRepository.createDiscussion(dto);

            return discussion;
        } catch (error) {
            throw new Error(error);
        }
    },

};