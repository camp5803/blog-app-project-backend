import db from '../database/index.js';
const { Post, Image, Category } = db;

export const createPost = async (postData) => {

        try {
            console.log(postData);

            const { user_id, title, content, categories, img } = postData;
            console.log('repository', postData);
    
            const post = await Post.create({
                user_id,
                title,
                content,
            });
    
            console.log('img', img);
            console.log('dbPost _ post_id', post.post_id);
    

            if (categories && categories.length > 0) {
                for (const categoryName of categories) {
                    const category = await Category.create({
                        post_id: post.post_id, 
                        category: categoryName,
                    });
    
                    await post.addCategory(category); 
                }
            }

            const image = await Image.create({
                post_id: post.post_id,
                image: img,
            });
            const dbCategories = await post.getCategories();
            const dbPost = await Post.findOne({ where: {post_id: post.post_id} });

            console.log('dbCategories::', dbCategories);
            console.log('dbPost::', dbPost);

            const resData = {
                post_id: dbPost.post_id,
                user_id: dbPost.user_id,
                title: dbPost.title,
                content: dbPost.content,
                categories: dbCategories.map((category) => category.category),
                created_at: dbPost.created_at,
                img: image.image,
            };
            return resData;
        } catch (error) {
            console.log(error)
            throw new Error('Error creating post in repository');
        }   
    }


export const updatePost = async (postData) => {
    
    try {
        console.log('repository', postData);
    
        const { post_id, title, content, img } = postData;
        
        console.log(postData)
        const post = await Post.update({title, content, updated_at: new Date()}, 
        { where: { post_id: post_id } }) 

        const image = await Image.update({image: img}, { where: {post_id: post_id } });

        const updatedPost = await Post.findOne({ where: { post_id } });
        const updatedImage = await Image.findOne({ where: { post_id } });

        const resData = {
            post_id: updatedPost.post_id,
            title: updatedPost.title,
            content: updatedPost.content,
            img: updatedImage.image,
            updateDt: updatedPost.updated_at
        };

        return resData;
        
    } catch (error) {
        console.log(error);
        throw new Error('Error updating post in repository');
    }
}

export const deletePost = async (postId) => {

    try {
        console.log('repository:::', postId)
        const post = await Post.destroy({where: { post_id: postId }});
    } catch (error) {
        console.log(error);
        throw new Error('Error delete post in repository');
    }
}