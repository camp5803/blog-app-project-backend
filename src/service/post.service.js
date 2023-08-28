import { createPost, updatePost, deletePost } from '@/repository/index';

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
    }
}