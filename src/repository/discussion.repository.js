import db from '../database/index.js';

const {Discussion, Profile, DiscussionImage, DiscussionCategory, DiscussionBookmark, DiscussionLike, sequelize} = db;

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
        const {discussionId, title, content, thumbnail, startTime, endTime} = dto;
        await Discussion.update({title, content, thumbnail, startTime, endTime, updatedAt: new Date()},
            {where: {discussionId}}, {transaction})
    },

    updateDiscussionCategory: async (discussionId, categories, transaction) => {
        await DiscussionCategory.destroy({where: {discussionId}});
        const category = await categories.map(category => ({discussionId, category}));
        await DiscussionCategory.bulkCreate(category, {transaction});
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

    getBookmarkById: async (userId, discussionId) => {
        return await DiscussionBookmark.findOne({where: {userId, discussionId}});
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

    getBookmark: async (userId, discussionId) => {
        return await DiscussionBookmark.findOne({where: {userId, discussionId}});
    },

    createBookmark: async (userId, discussionId) => {
        await DiscussionBookmark.create({userId, discussionId});
    },

    deleteBookmark: async (userId, discussionId) => {
        await DiscussionBookmark.destroy({where: {userId, discussionId}});
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
};