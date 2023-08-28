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
            const dbPost = await Post.findOne({where: post.post_id});

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

