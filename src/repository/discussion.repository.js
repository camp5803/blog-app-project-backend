import db from '../database/index.js';

const {Discussion, DiscussionImage, DiscussionCategory, DiscussionBookmark, DiscussionLike, sequelize} = db;

const createCategory = async (discussionId, categories, transaction) => {
    const category = categories.map(category => ({discussionId, category}));
    await DiscussionCategory.bulkCreate(category, {transaction});
};

const createImage = async (discussionId, images, transaction) => {
    const image = images.map(image => ({discussionId, image}))
    await DiscussionImage.bulkCreate(image, {transaction});
};

export const discussionRepository = {
    createDiscussion: async (dto) => {
        const transaction = await sequelize.transaction();
        const promises = [];

        try {
            const discussion = await Discussion.create(dto, {transaction});

            if (dto.category.length > 0) {
                promises.push(createCategory(discussion.discussionId, dto.category, transaction));
            }
            if (dto.image.length > 0) {
                promises.push(createImage(discussion.discussionId, dto.image, transaction));
            }

            await Promise.all(promises);
            await transaction.commit();

            return discussion;
        } catch (error) {
            await transaction.rollback();
            throw new Error(error);
        }
    },


};