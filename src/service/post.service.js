import * as postRepository from '@/repository/post.repository';
import {verifyToken, redisCli as redisClient} from "@/utils";

export const postService = {
    createPost: async (postData) => {
        try {
            const post = await postRepository.createPost(postData);
            return post;
        } catch (error) {
            throw new Error('Error creating post');
        }
    },

    verifyUser: async (req) => {
        const token = req.cookies["access_token"];
        if (!token) {
            return false;
        }

        const verifyResult = verifyToken(token);
        if (verifyResult.error) {
            return false
        }

        const user_id = verifyResult.user_id;
        const post_id = req.params.id;

        const post = await postRepository.findByPostId(post_id);
        return post.user_id === Number(user_id);
    },

    updatePost: async (postData) => {
        const post = await postRepository.updatePost(postData);

        // 게시물이 없는 경우
        if (post === 0) {
            return 0;
        }

        if (postData.img && postData.img.length > 0) {
            await postRepository.updatePostImage(postData.post_id, postData.img);
        }

        return post;
    },

    deletePost: async (post_id) => {
        try {
            console.log('service', post_id)
            const post = await postRepository.deletePost(post_id);
            return post;
        } catch (error) {
            console.log(error)
            throw new Error('Error delete post');
        }
    },

    increaseViewCount: async (ip, post) => {
        const viewerKey = `viewer:${post.post_id}:${ip}`;

        const isViewed = await redisClient.get(viewerKey);
        if (isViewed) {
            return post.view;
        }

        const EXPIRATION_TIME = 1800;   // 1800초(30분) 이내 조회 여부
        await redisClient.set(`viewer:${post.post_id}:${ip}`, new Date().getTime(), {EX: EXPIRATION_TIME});

        const updatedViewCount = await postRepository.increaseViewCount(post);
        return updatedViewCount
    },

    getByPostDetail: async (postId, isAuthor) => {
        try {
            // post detail 조회
            const post = await postRepository.findByPostId(postId);

            // 작성자 닉네임 조회
            const nickname = await postRepository.getUserNickname(post.user_id);

            // 좋아요 여부를 불리언으로 설정
            const liked = await postRepository.isLiked(post.user_id, post.post_id);

            const categories = await post.getCategories();
            const images = await post.getImages();

            const postDetail = {
                post_id: post.post_id,
                isAuthor,
                nickname,
                title: post.title,
                content: post.content,
                view: post.view,
                like: post.like,
                liked,
                categories: categories.map((category) => category.category),
                created_at: post.created_at,
                img: images.map((image) => image.image),
                thumbnail: post.thumbnail
            };

            return {postDetail, post};
        } catch (error) {
            console.log(error);
            throw new Error('Error get detail post');
        }
    },

    getPostsByPage: async (page, pageSize, order, id, sort) => {
        try {
            console.log('service, order', order);
            const post = await postRepository.getPostsByPage(page, pageSize, order, id, sort);
            return post;
        } catch (error) {
            console.log(error);
            throw new Error('Error get listbyPage post');
        }
    }, 

    toggleBookmark: async (user_id, post_id) => {
        try {
            console.log(user_id, post_id)
            const bookmark = await postRepository.toggleBookmark(user_id, post_id);
            return bookmark;
        } catch (error) {
            console.log(error);
            throw new Error('Error toggle bookmark post');
        }
    },

    toggleLike: async (user_id, post_id) => {
        try {
            const like = await postRepository.toggleLike(user_id, post_id);
            return like;
        } catch (error) {
            console.log(error);
            throw new Error('Error toggle like post');
        }
    }

}