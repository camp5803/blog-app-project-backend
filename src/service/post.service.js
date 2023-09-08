import * as postRepository from '@/repository/post.repository';

export const postService = {
    createPost: async (postData) => {
        try {
            const post = await postRepository.createPost(postData);
            return post;
        } catch (error) {
            throw new Error('Error creating post');
        }
    },

    verifyUser: async (post_id, user_id) => {
        const post = await postRepository.findByPostId(post_id);
        return post.user_id === Number(user_id) ? true : false;
    },

    updatePost: async (postData) => {
        try {
            console.log('service', postData);
            const post = await postRepository.updatePost(postData);
            return post;
        } catch (error) {
            console.log(error)
            throw new Error('Error updating post');
        }
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

    getByPostDetail: async (postId) => {
        try {
            // post detail 조회
            const post = await postRepository.findByPostId(postId);

            // 조회수 1 증가
            await postRepository.updatePostViewCount(post);

            // 작성자 닉네임 조회
            const nickname = await postRepository.getUserNickname(post.user_id);

            // 좋아요 여부를 불리언으로 설정
            const liked = await postRepository.isLiked(post.user_id, post.post_id);

            const categories = await post.getCategories();
            const images = await post.getImages();

            const postDetail = {
                post_id: post.post_id,
                user_id: post.user_id,
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

            return postDetail;
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