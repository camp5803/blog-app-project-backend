import db from '../database/index.js';
const { Post, Image } = db;

export const createPost = async (postData) => {

        try {
            console.log(postData);

            const {user_id, title, content, category_id, img} = postData;
            console.log('repository', postData);
            const dbPost = await Post.create({
                user_id,
                title,
                content,
                category_id,})
            console.log('img', img)
            console.log('dbPost _ post_id', dbPost.post_id)

            const image = await Image.create({
                post_id: dbPost.post_id,
                image: img,
            })

            const resData = {
                post_id: dbPost.post_id,
                user_id: dbPost.user_id,
                title: dbPost.title,
                content: dbPost.content,
                category: dbPost.category_id,
                createDt: dbPost.created_at.val,
                img: image.image
            }
            return resData;
        } catch (error) {
            console.log(error)
            throw new Error('Error creating post in repository');
        }   
    }

