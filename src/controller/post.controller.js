import { asyncWrapper } from '@/common/index';
import { postService } from '@/service/index';

export const createPost = asyncWrapper(async (req, res) => {
        try {
            const { user_id, title, content, categories, img} = req.body;
            const postsInput = {
                user_id: user_id,
                title: title,
                content: content,
                categories: categories,
                img: img,
            }
            console.log(postsInput);
            const post = await postService.createPost(postsInput);
            console.log('controller', post);
            res.status(201).send({ data: post });
        } catch (error) {
            res.status(500).send(error);
        }
})
