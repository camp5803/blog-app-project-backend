import {discussionRepository} from '@/repository/discussion.repository';
import {verifyToken, redisCli as redisClient} from "@/utils";
import db from '@/database/index';

export const discussionService = {
    createDiscussion: async (dto) => {
        const transaction = await db.sequelize.transaction();
        const promises = [];

        try {
            dto.view = 0;
            dto.like = 0;

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
        const transaction = await db.sequelize.transaction();

        try {
            const discussion = await discussionRepository.getDiscussionById(dto.discussionId);

            if (!discussion) {
                return 'Non-existent discussion';
            }
            if (Number(discussion.userId) !== Number(dto.userId)) {
                return 'Not the author';
            }

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