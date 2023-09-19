import {discussionRepository} from '@/repository/discussion.repository';
import {verifyToken, redisCli as redisClient} from "@/utils";
import db from '@/database/index';

export const discussionService = {
    createDiscussion: async (dto) => {
        try {
            dto.view = 0;
            dto.like = 0;

            const transaction = await db.sequelize.transaction();
            const promises = [];

            const discussion = await discussionRepository.createDiscussion(dto,transaction);
            if (dto.category.length > 0) {
                promises.push(discussionRepository.createCategory(discussion.discussionId, dto.category, transaction));
            }
            if (dto.image.length > 0) {
                promises.push(discussionRepository.createImage(discussion.discussionId, dto.image, transaction));
            }

            await Promise.all(promises);
            await transaction.commit();

            return discussion;
        } catch (error) {
            await transaction.rollback();
            throw new Error(error);
        }
    },

    updateDiscussion: async (dto) => {
        try {
            // discussionId 검증

            const transaction = await db.sequelize.transaction();

            await discussionRepository.updateDiscussion(dto, transaction);
            await discussionRepository.updateDiscussionCategory(dto.discussionId, dto.category, transaction);
            await discussionRepository.updateDiscussionImage(dto.discussionId, dto.image, transaction);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw new Error(error);
        }
    },
};