import db from '../database/index.js';

const {Discussion, Profile, DiscussionImage, DiscussionCategory, DiscussionLike, DiscussionUser} = db;

export const socketRepository = {
    getUserNickname: async (userId) => {
        const userProfile = await Profile.findOne({where: {userId}});
        return userProfile.nickname;
    },

    getUserIdBynickname: async (nickname) => {
        const userProfile = await Profile.findOne({where: {nickname}});
        return userProfile.userId;
    },

    getDiscussionUser: async (discussionId, userId, transaction) => {
        return await DiscussionUser.findOne({where: {discussionId, userId}}, {transaction});
    },

    getDiscussionUsers: async (discussionId, transaction) => {
        return await DiscussionUser.findAll({where: {discussionId}}, {transaction});
    },

    createDiscussionUser: async (discussionId, userId, transaction) => {
        return await DiscussionUser.create({userId, discussionId}, {transaction});
    },

    getDiscussionById: async (discussionId, transaction) => {
        return await Discussion.findByPk(discussionId, {transaction});
    },

    updateDiscussionProgress: async (discussionId, progress, transaction) => {
        return await Discussion.update({progress}, {where: {discussionId}}, {transaction});
    },

    banDiscussionUser: async (discussionId, userId, isBanned, transaction) => {
        return await DiscussionUser.update({isBanned: true}, {where: {discussionId, userId}}, {transaction});
    },
};