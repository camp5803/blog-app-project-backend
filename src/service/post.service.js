import { createPost, updatePost, deletePost, getByPostDetail, getByAllList } from '@/repository/index';

export const postService = {
    createPost: async (postData) => {
        try {
            console.log('service, postData::', postData);
            const post = await createPost(postData);
            console.log('repository -> service', post);
            return post;
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

    getByAllList: async () => {
        try {
            const post = await getByAllList();
            return post;
        } catch (error) {
            console.log(error);
            throw new Error('Error get all post list');
        }
    }
}