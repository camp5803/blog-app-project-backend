import {asyncWrapper} from '@/common';
import {postService} from '@/service/post.service';
import {StatusCodes} from 'http-status-codes';
import { customError } from '@/common/error';

export const postController = {
    createPost: asyncWrapper(async (req, res) => {
        const {title, content, categories, img, thumbnail} = req.body;
        const {userId} = req.user;

        const postsInput = {
            userId,
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
        const verification = await postService.verifyUser(req);

        if (verification) {
            res.status(StatusCodes.OK).json({message: 'ok'});
        } else {
            res.status(StatusCodes.FORBIDDEN).json({message: 'Permission Denied'});
        }
    }),

    updatePost: asyncWrapper(async (req, res) => {
        const {title, content, img, thumbnail} = req.body;
        const postId = req.params.id;
        const postData = {
            postId: postId,
            title: title,
            content: content,
            img: img,
            thumbnail: thumbnail
        }
        const post = await postService.updatePost(postData);

        if (post === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({message: 'Post not found'});
        }

        res.status(StatusCodes.CREATED).json({id: post.postId, message: 'update success'});
    }),

    deletePost: asyncWrapper(async (req, res) => {
        try {
            const postId = req.params.id;
            const post = await postService.deletePost(postId);
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
        const postId = req.params.id;
        if (!postId) {
            return res.status(400).json({message: 'Post ID is missing'});
        }

        const isAuthor = await postService.verifyUser(req);
        const {postDetail, post} = await postService.getByPostDetail(postId, isAuthor);
        if (!postDetail) {
            return res.status(404).json({message: 'Post not found'});
        }

        postDetail.view = await postService.increaseViewCount(req.ip, post);

        res.status(201).json(postDetail);
    }),

    getPostsByPage: asyncWrapper(async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; // 기본 페이지 1
            const pageSize = 10;
            const {sort} = req.params;
            const id = await postService.getUserIdFromToken(req);
            console.log('req.params', sort)
            console.log('page: ', page, ' pageSize: ', pageSize)
            let order = [];

            if (sort === 'views') {
                order = [['view', 'DESC']]; // 조회수 순으로 정렬
            } else if (sort === 'createdAt') {
                order = [['createdAt', 'DESC']]; // 최신순으로 정렬
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
            const {userId} = req.user;
            const postId = req.params.id;

            const bookmark = await postService.toggleBookmark(userId, postId);

            if (!bookmark) {
                res.status(200).json({bookmark: true, message: "bookmark add success"});
            } else {
                res.status(200).json({bookmark: false, message: "bookmark remove success"});
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }),

    toggleLike: asyncWrapper(async (req, res) => {
        try {
            const {userId} = req.user;
            const postId = req.params.id;

            const like = await postService.toggleLike(userId, postId);

            if (!like.isLiked) {
                res.status(200).json({liked: true, like: like.likeCount, message: "like success"});
            } else {
                res.status(200).json({liekd: false, like: like.likeCount, message: "like cancel success"});
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }),
    getPostsByType: asyncWrapper(async (req, res) => {
        if (!req.query.type) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Invaild argument.`);
        }
        switch (req.query.type) {
            case 'like': {
                const posts = await postService.getLikedPosts(req.user.userId);
                return res.status(StatusCodes.OK).json(posts);
            }
            case 'comment': {
                const posts = await postService.getCommentedPosts(req.user.userId);
                return res.status(StatusCodes.OK).json(posts);
            }
            case 'bookmark': {
                const posts = await postService.getBookmarkedPosts(req.user.userId);
                return res.status(StatusCodes.OK).json(posts);
            }
            case 'me': {
                const posts = await postService.getPostsById(req.user.userId);
                return res.status(StatusCodes.OK).json(posts);
            }
            default: {
                throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Invaild argument.`);
            }
        }
    }),
    getPostsByUserId: asyncWrapper(async (req, res) => {
        if (!req.params.id) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Invaild argument.`);
        }
        const posts = await postService.getPostsById(req.params.id, req.user.userId);
        res.status(StatusCodes.OK).json(posts);
    })
}
