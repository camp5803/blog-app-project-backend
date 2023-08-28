import { asyncWrapper } from '@/common/index';
import { postService } from '@/service/index';
import { StatusCodes } from 'http-status-codes';

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

export const updatePost = asyncWrapper(async (req, res) => {

    try {
        const { title, content, img } = req.body;
        
        const postData = {
            post_id: req.params.id,
            title: title,
            content: content,
            img: img
        }
        console.log(postData);
        const post = await postService.updatePost(postData);
        res.status(201).send(post);
    } catch (error) {  
        res.status(500).send(error);
    }

})

export const deletePost = asyncWrapper(async (req, res) => {
    try {
       const post_id = req.params.id;
        const post = await postService.deletePost(post_id);
        res.status(201).send({result: true, message: 'delete success'});
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
})

export const getByPostDetail = asyncWrapper (async (req, res) => {
    try {
        const post_id = req.query.id;
        console.log(post_id)
        const post = await postService.getByPostDetail(post_id);
        res.status(201).send(post);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
})

export const getByAllList = asyncWrapper (async (req, res) => {
    try {
        const post = await postService.getByAllList();
        res.status(201).send(post);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
})