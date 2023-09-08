import {asyncWrapper} from '@/common';
import {postService} from '@/service';
import {StatusCodes} from 'http-status-codes';

module.exports = {
    createPost: asyncWrapper(async (req, res) => {
        const {title, content, categories, img, thumbnail} = req.body;
        const {user_id} = req.user;

        const postsInput = {
            user_id,
            title,
            content,
            categories,
            thumbnail,
            img
        }
        const post = await postService.createPost(postsInput);

        res.status(StatusCodes.CREATED).json({id: post, message: 'create success'});
    }),

    verifyUser: asyncWrapper(async (req, res) => {
        const post_id = req.params.id;
        const {user_id} = req.user;

        const verification = await postService.verifyUser(post_id, user_id);

        if (verification) {
            res.status(StatusCodes.OK).json({message: 'ok'});
        } else {
            res.status(StatusCodes.FORBIDDEN).json({message: 'Permission Denied'});
        }
    }),

    updatePost: asyncWrapper(async (req, res) => {
        const {title, content, img, thumbnail} = req.body;
        const post_id = req.params.id;
        const postData = {
            post_id: post_id,
            title: title,
            content: content,
            img: img,
            thumbnail: thumbnail
        }
        console.log(postData);
        const post = await postService.updatePost(postData);

        if (post === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({message: 'Post not found'});
        }

        res.status(StatusCodes.CREATED).json({id: post.post_id, message: 'update success'});
    }),

    deletePost: asyncWrapper(async (req, res) => {
        try {
            const post_id = req.params.id;
            const post = await postService.deletePost(post_id);
            if (post === 0) {
                return res.status(404).json({message: 'Post not found'});
            }
            res.status(201).json({message: 'delete success'});
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }),

    getByPostDetail: asyncWrapper(async (req, res) => {
        try {
            const post_id = req.params.id;
            if (!post_id) {
                return res.status(400).json({message: 'Post ID is missing'});
            }
            const post = await postService.getByPostDetail(post_id);
            if (!post) {
                return res.status(404).json({message: 'Post not found'});
            }
            res.status(201).json(post);
        } catch (error) {
            console.error(error.message);
            res.status(500).json(error);
        }
    }),

    getPostsByPage: asyncWrapper(async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; // 기본 페이지 1
            const pageSize = 10;
            const {sort, id} = req.params;
            console.log('req.params', sort)
            console.log('page: ', page, ' pageSize: ', pageSize)
            let order = [];

            if (sort === 'views') {
                order = [['view', 'DESC']]; // 조회수 순으로 정렬
            } else if (sort === 'created_at') {
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
    }),

    toggleBookmark: asyncWrapper(async (req, res) => {
        try {
            const {user_id} = req.user;
            const {post_id} = req.body;
            console.log(user_id, post_id)

            const bookmark = await postService.toggleBookmark(user_id, post_id);

            if (bookmark === 'add') {
                res.status(200).json({message: "bookmark add success"});
            } else if (bookmark === 'remove') {
                res.status(200).json({message: "bookmark remove success"});
            } else {
                // 예상치 못한 경우에 대한 처리
                res.status(500).json({message: "Unknown bookmark action"});
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }),

    toggleLike: asyncWrapper(async (req, res) => {
        try {
            const {user_id} = req.user;
            const {post_id} = req.body;
            console.log(user_id, post_id)

            const like = await postService.toggleLike(user_id, post_id);
            if (like === 'like') {
                res.status(200).json({liked: true, message: "like success"});
            } else if (like === 'cancel') {
                res.status(200).json({liekd: false, message: "like cancel success"});
            } else {
                res.status(500).json({message: "Unknown like action"});
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    })
}
