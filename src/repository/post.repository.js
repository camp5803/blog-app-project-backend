import db from '../database/index.js';

const {Post, Image, Category, Profile, Neighbor, Bookmark, Like, User} = db;
import { col, literal, Op } from 'sequelize';

export const postRepository = {
    findByPostId: async (postId) => {
        return await Post.findOne({where: {postId}});
    },

    createPost: async (postData) => {
        try {
            const {userId, title, content, categories, img, thumbnail} = postData;

            const post = await Post.create({
                userId,
                title,
                content,
                categories,
                thumbnail,
                view: 0,
                like: 0
            });

            if (categories && categories.length > 0) {
                for (const categoryName of categories) {
                    const category = await Category.create({
                        postId: post.postId,
                        category: categoryName,
                    });

                    await post.addCategory(category);
                }
            }

            if (img && img.length > 0) {
                for (let i = 0; i < img.length; i++) {
                    const image = await Image.create({
                        postId: post.postId,
                        image: img[i], // 이미지 배열의 순서대로 저장
                    });
                    await post.addImage(image);
                }
            }

            const dbCategories = await post.getCategories();
            const dbPost = await Post.findOne({where: {postId: post.postId}});

            return post.postId;
        } catch (error) {
            console.error(error.message);
            throw new Error('Error creating post in repository');
        }
    },


    updatePost: async (postData) => {
        const {postId, title, content, thumbnail} = postData;
        const [post] = await Post.update({title, content, thumbnail, updatedAt: new Date()},
            {where: {postId: postId}})
        return post;
    },

    // todo 이미지 삭제 후 새로 insert -> 고도화 때 업데이트로 수정 예정
    updatePostImage: async (postId, img) => {
        await Image.destroy({where: {postId}});
        for (const image of img) {
            await Image.create({postId, image});
        }
    },

    deletePost: async (postId) => {

        try {
            console.log('repository:::', postId)
            const post = await Post.destroy({where: {postId: postId}});
            console.log('delete post row : ', post) // 1 정상적으로 삭제될 경우

            if (post === 0) {
                // 이미 삭제된 경우
                throw new Error('Post not found');
            }

            return post;
        } catch (error) {
            console.log(error);
            throw new Error('Error delete post in repository');
        }
    },

    increaseViewCount: async (post) => {
        post.view += 1;
        await post.save();
        return post.view;
    },

    getUserNickname: async (userId) => {
        const userProfile = await Profile.findOne({where: {userId}});
        return userProfile.nickname;
    },

    isLiked: async (userId, postId) => {
        const like = await Like.findOne({where: {userId, postId}});
        return !!like;
    },

    getPostsByPage: async (page, pageSize, order, id, sort) => {
        try {
            console.log('order', order);
            const offset = (page - 1) * pageSize;
            const whereClause = {}; // whereClause를 정의
            const limit = pageSize;

            const neighbor = await Neighbor.findOne({where: {userId: id}});
            console.log(neighbor);
            let posts;

            if (sort === 'neighbor') {
                // 이웃 글 목록을 가져옴
                const neighbor = await Neighbor.findOne({where: {userId: id}});
                posts = await Post.findAndCountAll({
                    where: {userId: neighbor.followsTo},
                    offset,
                    limit,
                    include: [
                        {
                            model: Category,
                            as: 'categories',
                            attributes: ['category'],
                        },
                    ],
                    order: [['createdAt', 'DESC']],
                });
            } else {
                // 그 외의 경우 전체 글 목록을 가져옴
                posts = await Post.findAndCountAll({
                    where: whereClause,
                    offset,
                    limit,
                    include: [
                        {
                            model: Category,
                            as: 'categories',
                            attributes: ['category'],
                        },
                    ],
                    order: order,
                });
            }

            const resultPosts = [];

            // 각 포스트마다 사용자 정보 추가
            for (const post of posts.rows) {
                const userProfile = await Profile.findOne({where: {userId: post.userId}});
                post.dataValues.nickname = userProfile.nickname;

                const bookmark = await Bookmark.findOne({where: {postId: post.postId}});
                post.dataValues.bookmarked = !!bookmark;

                const like = await Like.findOne({where: {userId: id, postId: post.postId}});
                const liked = !!like; // 좋아요 여부를 불리언으로 설정

                resultPosts.push({
                    postId: post.postId,
                    thumbnail: post.thumbnail,
                    title: post.title,
                    content: post.content,
                    nickname: post.dataValues.nickname,
                    createdAt: post.createdAt,
                    categories: post.categories.map((category) => category.category),
                    bookmarked: post.dataValues.bookmarked,
                    view: post.view,
                    like: post.like,
                    liked: liked, // 좋아요 여부 추가
                });
            }
            const rowLength = posts.rows.length;
            const hasMore = rowLength === pageSize;

            return {
                posts: resultPosts,
                hasMore: hasMore,
            };
        } catch (error) {
            console.log(error);

            throw new Error('Error get post in repository');
        }
    },

    getBookmark: async (userId, postId) => {
        return await Bookmark.findOne({where: {userId, postId}});
    },

    createBookmark: async (userId, postId) => {
        await Bookmark.create({userId, postId});
    },

    deleteBookmark: async (userId, postId) => {
        await Bookmark.destroy({where: {userId, postId}});
    },

    getLike: async (userId, postId) => {
        const like = await Like.findOne({where: {userId, postId}});
        const likeCount = await Like.count({where: {postId}});
        return {like, likeCount};
    },

    createLike: async (userId, postId) => {
        await Like.create({userId, postId});
    },

    deleteLike: async (userId, postId) => {
        await Like.destroy({where: {userId, postId}});
    },

    updatePostLike: async (postId, likeCount) => {
        await Post.update({like: likeCount}, {where: {postId}});
    },

    getPostsById: async (userId) => {
        return await Post.findAll({ 
            where: { userId },
            attributes: ['postId', 'userId', 'title', 'content', 'like', 'view', 'createdAt'],
            include: [{ model: Category, attribute: 'category' }],
        });
    },
    getPostIdByLike: async (userId) => {
        return await Like.findAll({ 
            where: { userId },
            attribute: 'postId'
        });
    },
    getPostIdByBookmark: async (userId) => {
        return await Bookmark.findAll({
            where: { userId },
            attribute: 'postId'
        });
    },
    getPostsByPostIds: async (postIds) => {
        return await Post.findAll({
            where: { postId: { [Op.in]: postIds }},
            attributes: ['postId', 'userId', 'title', 'content', 'like', 'view', 'createdAt'],
            include: [{ model: Category, attribute: 'category' }],
        });
    },
    getPostsByIdWithBookmark: async (userId) => {
        return await Post.findAll({
            where: { userId },
            attributes: ['postId', 'userId', 'title', 'content', 'like', 'view', 'createdAt'],
            include: [{ model: Category, attribute: 'category' }],
        });
    },
    getBookmarkByUserId: async (userId) => {
        return await Bookmark.findAll({
            where: { userId },
            attribute: 'postId'
        });
    }
};