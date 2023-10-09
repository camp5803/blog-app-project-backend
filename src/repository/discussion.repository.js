import db from '../database/index.js';

const {Discussion, Profile, DiscussionImage, DiscussionCategory, DiscussionLike, DiscussionUser} = db;
import { Op } from 'sequelize';

export const discussionRepository = {
    getDiscussionById: async (discussionId) => {
        return await Discussion.findByPk(discussionId);
    },

    createDiscussion: async (dto, transaction) => {
        return await Discussion.create(dto, {transaction});
    },

    createCategory: async (discussionId, categories, transaction) => {
        const category = categories.map(category => ({discussionId, category}));
        await DiscussionCategory.bulkCreate(category, {transaction});
    },

    createImage: async (discussionId, images, transaction) => {
        const image = images.map(image => ({discussionId, image}))
        await DiscussionImage.bulkCreate(image, {transaction});
    },

    updateDiscussion: async (dto, transaction) => {
        const {discussionId, title, content, thumbnail, endTime, capacity} = dto;
        await Discussion.update({title, content, thumbnail, endTime, capacity, updatedAt: new Date()},
            {where: {discussionId}}, {transaction})
    },

    updateDiscussionImage: async (discussionId, images, transaction) => {
        await DiscussionImage.destroy({where: {discussionId}});
        const image = images.map(image => ({discussionId, image}))
        await DiscussionImage.bulkCreate(image, {transaction});
    },

    deleteDiscussion: async (discussionId) => {
        await Discussion.destroy({where: {discussionId}});
    },

    getDiscussionByPage: async (offset, limit, order) => {
        return await Discussion.findAndCountAll({
            include: [{
                model: DiscussionCategory,
                attributes: ['category'],
            }],
            offset,
            limit,
            order
        });
    },

    getProfileById: async (userId) => {
        return await Profile.findByPk(userId);
    },

    getLikeById: async (userId, discussionId) => {
        return await DiscussionLike.findOne({where: {userId, discussionId}});
    },

    getDiscussionByDetail: async (discussionId) => {
        return await Discussion.findOne({
            where: {discussionId},
            include: [{
                model: DiscussionCategory,
                attributes: ['category'],
            }, {
                model: DiscussionImage,
                attributes: ['image'],
            }]
        });
    },

    increaseViewCount: async (discussion) => {
        discussion.view += 1;
        await discussion.save();
        return discussion.view;
    },

    getLike: async (userId, discussionId) => {
        const like = await DiscussionLike.findOne({where: {userId, discussionId}});
        const likeCount = await DiscussionLike.count({where: {discussionId}});
        return {like, likeCount};
    },

    createLike: async (userId, discussionId) => {
        await DiscussionLike.create({userId, discussionId});
    },

    deleteLike: async (userId, discussionId) => {
        await DiscussionLike.destroy({where: {userId, discussionId}});
    },

    updatePostLike: async (discussionId, likeCount) => {
        await Discussion.update({like: likeCount}, {where: {discussionId}});
    },

    getDiscussionUser: async (userId, discussionId) => {
        return await DiscussionUser.findOne({where: {userId, discussionId}});
    },

    getDiscussionUserCount: async (discussionId) => {
        return await DiscussionUser.count({where: {discussionId, isBanned: false}});
    },

    createDiscussionUser: async (userId, discussionId, transaction) => {
        return await DiscussionUser.create({userId, discussionId}, {transaction});
    },

    deleteDiscussionUser: async (userId, discussionId) => {
        await DiscussionUser.destroy({where: {userId, discussionId}});
    },
    findByUserId: async (userId) => {
        return await Discussion.findAll({ 
            where: { userId: { [Op.in]: userId }},
            attributes: ['discussionId', 'title', 'content', 'createdAt', 'startTime', 'endTime', 'userId'],
            include: [{ model: DiscussionCategory, attribute: 'category' }]
        });
    },
    getDiscussionByUserId: async (userId) => {
        return await DiscussionUser.findAll({
            where: { userId },
        });
    },
    getDiscussionCategory: async (userIds) => {
        return await DiscussionCategory.findAll({
            where: {[Op.in]: userIds}
        });
    }
};