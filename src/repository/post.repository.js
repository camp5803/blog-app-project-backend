import db from '../database/index.js';
const { Post, Image, Category, User } = db;

export const createPost = async (postData) => {
        try {
            const { user_id, title, content, categories, img } = postData;
            console.log('repository', postData);
    
            const post = await Post.create({
                user_id,
                title,
                content,
                categories,
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
        const [post] = await Post.update({title, content, updated_at: new Date()}, 
        { where: { post_id: post_id } }) 

        // 게시물이 없는 경우
        if (post === 0) {
            return 0;
        }

        const image = await Image.update({image: img}, { where: {post_id: post_id } });

        const updatedPost = await Post.findOne({ where: { post_id } });
        const updatedImage = await Image.findOne({ where: { post_id } });
        return post;
    } catch (error) {
        console.log(error);
        throw new Error('Error updating post in repository');
    }
}

export const deletePost = async (postId) => {

    try {
        console.log('repository:::', postId)
        const post = await Post.destroy({where: { post_id: postId }});
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
}

export const getByPostDetail = async (postId) => {
    try {
        console.log('repository ::', postId)
        const post = await Post.findOne({where: { post_id: postId }});
        const user = await User.findOne({where: {user_id: post.user_id}})

        const categories = await post.getCategories();

        let image = null;
        const imageResult = await Image.findOne({ where: { post_id: postId } });
        if (imageResult) {
            image = imageResult.image;
        }

        const resData = {
            post_id: post.post_id,
            nickname: user.nickname,
            title: post.title,
            content: post.content,
            view: post.view,
            like: post.like,
            categories: categories.map((category) => category.category),
            createdDt: post.created_at,
            image: image
        };
        console.log(resData)
        return resData;
    } catch (error) {
        console.log(error);
        throw new Error('Error delete post in repository');
    }
}
