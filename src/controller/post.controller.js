import { asyncWrapper } from '@/common/index';
import { postService } from '@/service/index';
import { StatusCodes } from 'http-status-codes';

export const createPost = asyncWrapper(async (req, res) => {
    const post = await postService.createPost({
        user_id: req.body.user_id,
        title: req.body.title,
        content: req.body.content,
        category_id: req.body.category_id,
        img: req.body.img
    });

    res.status(StatusCodes.CREATED).end();
});