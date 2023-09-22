import {discussionRepository} from '@/repository/discussion.repository';
import {verifyToken, redisCli as redisClient} from "@/utils";
import db from '@/database/index';

export const discussionService = {
    validateDiscussionId: async (discussionId) => {
        const discussion = await discussionRepository.getDiscussionById(discussionId);
        return !!discussion;
    },

    getUserIdFromToken: async (req) => {
        const token = req.cookies["accessToken"];
        if (!token) {
            return false;
        }

        const verifyResult = verifyToken(token);
        if (verifyResult.error) {
            return false
        }

        return verifyResult.userId;
    },

    createDiscussion: async (dto) => {
        const transaction = await db.sequelize.transaction();
        const promises = [];

        try {
            dto.view = 0;
            dto.like = 0;

            const discussion = await discussionRepository.createDiscussion(dto, transaction);
            if (dto.category.length > 0) {
                promises.push(discussionRepository.createCategory(discussion.discussionId, dto.category, transaction));
            }
            if (dto.image.length > 0) {
                promises.push(discussionRepository.createImage(discussion.discussionId, dto.image, transaction));
            }
            await discussionRepository.createDiscussionUser(dto.userId, discussion.discussionId, transaction);

            await Promise.all(promises);
            await transaction.commit();

            return discussion.discussionId;
        } catch (error) {
            await transaction.rollback();
            throw new Error(error);
        }
    },

    updateDiscussion: async (dto) => {
        const transaction = await db.sequelize.transaction();

        try {
            const discussion = await discussionRepository.getDiscussionById(dto.discussionId);

            if (Number(discussion.userId) !== Number(dto.userId)) {
                return 'Not the author';
            }

            await discussionRepository.updateDiscussion(dto, transaction);
            await discussionRepository.updateDiscussionImage(dto.discussionId, dto.image, transaction);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw new Error(error);
        }
    },

    deleteDiscussion: async (discussionId, userId) => {
        try {
            const discussion = await discussionRepository.getDiscussionById(discussionId);

            if (Number(discussion.userId) !== Number(userId)) {
                return 'Not the author';
            }

            await discussionRepository.deleteDiscussion(discussionId);
        } catch (error) {
            throw new Error(error);
        }
    },

    //todo 차단 유저 글 안보이게
    getDiscussionByPage: async (page, pageSize, sort, userId) => {
        try {
            const offset = (page - 1) * pageSize || 0;
            const limit = pageSize;
            let order = [['createdAt', 'DESC']];

            if (sort === 'views') {
                order = [['view', 'DESC']]; // 조회수 순으로 정렬
            }

            const discussions = await discussionRepository.getDiscussionByPage(offset, limit, order);

            const totalPages = Math.ceil(discussions.count / pageSize);

            const results = [];
            for (const discussion of discussions.rows) {
                const result = {
                    discussionId: discussion.discussionId,
                    thumbnail: discussion.thumbnail,
                    title: discussion.title,
                    startTime: discussion.startTime,
                    endTime: discussion.endTime,
                    category: discussion.discussion_categories.map((category) => category.category),
                    participating: false,
                    liked: false,
                    like: discussion.like,
                    // view: discussion.view,
                    remainingTime: Math.max(parseInt((discussion.endTime - new Date()) / 1000), 0),
                    capacity: discussion.capacity,
                };

                result.nickname = (await discussionRepository.getProfileById(discussion.userId)).nickname;
                result.participants = await discussionRepository.getDiscussionUserCount(discussion.discussionId);

                if (userId) {
                    result.participating = !!(await discussionRepository.getDiscussionUser(userId, discussion.discussionId));
                    result.liked = !!(await discussionRepository.getLikeById(userId, discussion.discussionId));
                }

                results.push(result);
            }

            return {
                hasMore: totalPages > page,
                discussions: results
            }
        } catch (error) {
            throw new Error(error);
        }
    },

    //todo 강퇴 시 조회 x
    getDiscussionByDetail: async (discussionId, userId) => {
        try {
            const discussion = await discussionRepository.getDiscussionByDetail(discussionId);

            const result = {
                discussionId: discussion.discussionId,
                thumbnail: discussion.thumbnail,
                title: discussion.title,
                content: discussion.content,
                category: discussion.discussion_categories.map((category) => category.category),
                image: discussion.discussion_images.map((image) => image.image),
                participating: false,
                liked: false,
                isAuthor: false,
                like: discussion.like,
                // view: discussion.view,
                startTime: discussion.startTime,
                endTime: discussion.endTime,
                remainingTime: Math.max(parseInt((discussion.endTime - new Date()) / 1000), 0),
                // elapsedTime:
            };

            const userProfile = await discussionRepository.getProfileById(discussion.userId);
            result.nickname = userProfile.nickname;

            if (userId) {
                result.liked = !!(await discussionRepository.getLikeById(userId, discussion.discussionId));
                result.isAuthor = Number(discussion.userId) === Number(userId)
            }

            return {result, discussion}
        } catch (error) {
            throw new Error(error);
        }
    },

    increaseViewCount: async (ip, discussion) => {
        try {
            const viewerKey = `viewer:discussionId:${discussion.discussionId}:ip:${ip}`;

            const isViewed = await redisClient.get(viewerKey);
            if (isViewed) {
                return discussion.view;
            }

            const EXPIRATION_TIME = 1800;   // 1800초(30분) 이내 조회 여부
            await redisClient.set(viewerKey, new Date().getTime(), {EX: EXPIRATION_TIME});

            return await discussionRepository.increaseViewCount(discussion);
        } catch (error) {
            throw new Error(error);
        }
    },

    toggleLike: async (userId, discussionId) => {
        try {
            let {like, likeCount} = await discussionRepository.getLike(userId, discussionId);

            if (like) {
                await discussionRepository.deleteLike(userId, discussionId);
                likeCount--;
            } else {
                await discussionRepository.createLike(userId, discussionId);
                likeCount++;
            }

            await discussionRepository.updatePostLike(discussionId, likeCount);

            return {isLiked: !!like, likeCount};
        } catch (error) {
            throw new Error(error);
        }
    },

    createDiscussionUser: async (userId, discussionId) => {
        try {
            const isExisted = await discussionRepository.getDiscussionUser(userId, discussionId);

            if (isExisted) {
                if (isExisted.isBanned) {
                    return 'Banned user';
                } else {
                    return 'Already participating';
                }
            }

            return await discussionRepository.createDiscussionUser(userId, discussionId);
        } catch (error) {
            throw new Error(error);
        }
    },

    deleteDiscussionUser: async (userId, discussionId) => {
        try {
            const isExisted = await discussionRepository.getDiscussionUser(userId, discussionId);

            if (!isExisted) {
                return 'Not participating';
            }

            if (isExisted.isBanned) {
                return 'Banned user';
            } else {
                return await discussionRepository.deleteDiscussionUser(userId, discussionId);
            }
        } catch (error) {
            throw new Error(error);
        }
    },
};