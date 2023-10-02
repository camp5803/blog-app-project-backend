import db from '../database/index.js';

const {Post, Profile, Comment, Block} = db;

export const commentRepository = {
    getComment: async (postId, commentId) => {
        return await Comment.findOne({where: {postId, commentId}});
    },

    getCommentCount: async (postId) => {
        return await Comment.count({where: {postId}});
    },

    getBlockedUser: async (userId) => {
        return await Block.findAll({attributes: ['blockUserId'], where: {userId}});
    },

    getCommentList: async (filter, pagenation = null) => {
        const options = {
            attributes: ['userId', 'createdAt', 'commentId', 'content', 'profile.image_url', 'profile.nickname', 'isDeleted'],
            where: filter,
            include: [
                {
                    model: Profile,
                    attributes: ['nickname', 'imageUrl'],
                    required: false,
                },
            ]
        };

        if (pagenation) {
            options.offset = pagenation.offset;
            options.limit = pagenation.limit;
        }
        return await Comment.findAndCountAll(options);
    },

    createComment: async (userId, postId, content, parentId, depth) => {
        return await Comment.create({userId, postId, content, parentId, depth});
    },

    updateComment: async (userId, commentId, content) => {
        const [result] =  await Comment.update({content, updatedAt: new Date()}, {where: {userId, commentId}});
        return !!result;
    },

    deleteComment: async (userId, commentId) => {
        const [result] = await Comment.update({isDeleted: true, deletedAt: new Date()},{where: {userId, commentId}});
        return !!result;
    },
    getPostIdByUserId: async (userId) => {
        return await Comment.findAll({
            where: { userId },
            attribute: 'postId'
        });
    }
};
