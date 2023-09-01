import { asyncWrapper } from '@/common/index';
import { postService } from '@/service/index';
import { StatusCodes } from 'http-status-codes';

export const createPost = asyncWrapper(async (req, res) => {
        try {
            const { user_id, title, content, categories, img } = req.body;
            const postsInput = {
                user_id: user_id,
                title: title,
                content: content,
                categories: categories,
                img: img
            }
            console.log(postsInput);

            const post = await postService.createPost(postsInput);

            res.status(201).json({ id: post, message: 'create success' });
        } catch (error) {
            res.status(500).json(error);
        }
})

export const updatePost = asyncWrapper(async (req, res) => {

    try {
        const { title, content, img } = req.body;
        const post_id = req.params.id;
        const postData = {
            post_id: post_id,
            title: title,
            content: content,
            img: img
        }
        console.log(postData);
        const post = await postService.updatePost(postData);

        if (post === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(201).json({ id: post.post_id, message: 'update success' });
    } catch (error) {  
        res.status(500).json(error);
    }

})

export const deletePost = asyncWrapper(async (req, res) => {
    try {
       const post_id = req.params.id;
        const post = await postService.deletePost(post_id);
        if(post === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(201).json({ message: 'delete success' });
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
})

export const getByPostDetail = asyncWrapper (async (req, res) => {
    try {
        const post_id = req.params.id;
        console.log(post_id)
        if (!post_id) {
            return res.status(400).json({ message: 'Post ID is missing' });
        }
        const post = await postService.getByPostDetail(post_id);
        console.log(post);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(201).json(post);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
})

export const getPostsByPage = asyncWrapper( async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // 기본 페이지 1
        const pageSize = 10;
        const { sort, id } = req.params; 
        console.log('req.params',sort)
        console.log('page: ', page, ' pageSize: ',pageSize)
        let order = [];

            if (sort === 'views') {
                order = [['view', 'DESC']]; // 조회수 순으로 정렬
            } else if (sort === 'created_at'){
                order = [['created_at', 'DESC']]; // 최신순으로 정렬
            } 
 
        const result = await postService.getPostsByPage(page, pageSize, order, id, sort);

            console.log(result.hasMore)
            res.status(201).json({   
                hasMore: result.hasMore, // 다음 페이지 여부, false면 더이상 데이터 X
                posts: result.posts,
            })
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
})

export const addBookmark = asyncWrapper ( async (req, res) => {
    try {
        const {user_id, post_id} = req.body;
        console.log(user_id, post_id)

        const post = await postService.addBookmark(user_id, post_id);

        res.status(201).json({ message: 'bookmark add success' });
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
})