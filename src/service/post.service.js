import {postRepository} from '@/repository/post.repository';
import {verifyToken, redisCli as redisClient} from "@/utils";

export const postService = {
    getUserIdFromToken: async (req) => {
        const token = req.cookies["accessToken"];
        if (!token) {
            return false;
        }

        const verifyResult = verifyToken(token);
        if (verifyResult.error) {
            return false
        }

        return  verifyResult.userId;
    },

    createPost: async (postData) => {
        try {
            const post = await postRepository.createPost(postData);
            return post;
        } catch (error) {
            throw new Error('Error creating post');
        }
    },

    verifyUser: async (req) => {
        const token = req.cookies["accessToken"];
        if (!token) {
            return false;
        }

        const verifyResult = verifyToken(token);
        if (verifyResult.error) {
            return false
        }

        const userId = verifyResult.userId;
        const postId = req.params.id;

        const post = await postRepository.findByPostId(postId);
        return post.userId === Number(userId);
    },

    updatePost: async (postData) => {
        const post = await postRepository.updatePost(postData);

        // 게시물이 없는 경우
        if (post === 0) {
            return 0;
        }

        if (postData.img && postData.img.length > 0) {
            await postRepository.updatePostImage(postData.postId, postData.img);
        }

        return post;
    },

    deletePost: async (postId) => {
        try {
            console.log('service', postId)
            const post = await postRepository.deletePost(postId);
            return post;
        } catch (error) {
            console.log(error)
            throw new Error('Error delete post');
        }
    },

    increaseViewCount: async (ip, post) => {
        const viewerKey = `viewer:${post.postId}:${ip}`;

        const isViewed = await redisClient.get(viewerKey);
        if (isViewed) {
            return post.view;
        }

        const EXPIRATION_TIME = 1800;   // 1800초(30분) 이내 조회 여부
        await redisClient.set(`viewer:${post.postId}:${ip}`, new Date().getTime(), {EX: EXPIRATION_TIME});

        const updatedViewCount = await postRepository.increaseViewCount(post);
        return updatedViewCount
    },

    getByPostDetail: async (postId, isAuthor) => {
        try {
            // post detail 조회
            const post = await postRepository.findByPostId(postId);

            // 작성자 닉네임 조회
            const nickname = await postRepository.getUserNickname(post.userId);

            // 좋아요 여부를 불리언으로 설정
            const liked = await postRepository.isLiked(post.userId, post.postId);

            const categories = await post.getCategories();
            const images = await post.getImages();

            const postDetail = {
                postId: post.postId,
                isAuthor,
                nickname,
                title: post.title,
                content: post.content,
                view: post.view,
                like: post.like,
                liked,
                categories: categories.map((category) => category.category),
                createdAt: post.createdAt,
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

    toggleBookmark: async (userId, postId) => {
        try {
            const bookmark = await postRepository.getBookmark(userId, postId);

            if (bookmark) {
                await postRepository.deleteBookmark(userId, postId);
            } else {
                await postRepository.createBookmark(userId, postId);
            }

            return !!bookmark;
        } catch (error) {
            console.log(error);
            throw new Error('Error toggle bookmark post');
        }
    },

    toggleLike: async (userId, postId) => {
        try {
            let {like, likeCount} = await postRepository.getLike(userId, postId);

            if (like) {
                await postRepository.deleteLike(userId, postId);
                likeCount--;
            } else {
                await postRepository.createLike(userId, postId);
                likeCount++;
            }

            // todo 좋아요 동시성 처리 및 좋아요 수 가져오는 로직 변경 필요성 확인
            await postRepository.updatePostLike(postId, likeCount);

            return {isLiked: !!like, likeCount};
        } catch (error) {
            console.log(error);
            throw new Error('Error toggle like post');
        }
    },
};