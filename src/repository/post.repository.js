import db from '@/database/index';
import { asyncWrapper } from '@/common/index';
const { Post, Image } = db;

export const createPost = asyncWrapper(async (postData) => {
    const { user_id, title, content, category_id, img } = postData;

    const dbPost = await Post.create({
        user_id,
        title,
        content,
        category_id
    });

    const image = await Image.create({
        post_id: dbPost.post_id,
        image: img,
    });

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
});

