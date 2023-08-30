import { createPost, updatePost, deletePost, getByPostDetail, getPostsByPage } from '@/repository/index';

export const postService = {
    createPost: async (postData) => {
        try {
            console.log('service, postData::', postData);
            const post = await createPost(postData);
        } catch (error) {
            throw new Error('Error creating post');
        }
    },

    updatePost: async (postData) => {
        try {
            console.log('service', postData);
            const post = await updatePost(postData);
            return post;
        } catch (error) {
            console.log(error)
            throw new Error('Error updating post');
        }
    },

    deletePost: async (post_id) => {
        try {
            console.log('service', post_id)
            const post = await deletePost(post_id);
            return post;
        } catch (error) {
            console.log(error)
            throw new Error('Error delete post');
        }
    },
    getByPostDetail: async (postId) => {
        try {
            const post = await getByPostDetail(postId);
            return post;
        } catch (error) {
            console.log(error);
            throw new Error('Error get detail post');
        }
    },

    getPostsByPage: async (page, pageSize) => {
        try {
            const post = await getPostsByPage(page, pageSize);
            return post;
        } catch (error) {
            console.log(error);
            throw new Error('Error get listbyPage post');
        }
    },
}