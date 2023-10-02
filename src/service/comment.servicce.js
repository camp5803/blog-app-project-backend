import {commentRepository} from '@/repository/comment.repository';

const convertComment = (comment, blockUser) => {
    comment.isBlocked = blockUser.includes(comment.userId);
    comment.nickname = comment.profile.nickname;
    comment.profileImg = comment.profile.imageUrl;
    delete comment.profile;

    if (comment.isBlocked) {
        comment.content = 'Blocked comment';
    }
    if (comment.isDeleted) {
        comment.content = 'Deleted comment';
    }
};

export const commentService = {
    createComment: async (userId, postId, content, parentId) => {
        try {
            let depth = 0;
            if (parentId) {
                const parent = await commentRepository.getComment(postId, parentId);
                depth = parent.depth + 1;
            }

            const comment = await commentRepository.createComment(userId, postId, content, parentId, depth);

            return comment;
        } catch (error) {
            console.log(error);
            throw new Error('Error create comment');
        }
    },

    getCommentByPage: async (postId, page, pageSize, userId) => {
        try {
            // todo 갯글 로직 최적화 필요 (고도화)
            let blockUser = [];
            if (userId) {
                blockUser = (await commentRepository.getBlockedUser(userId)).map(obj => obj.blockUserId);
            }

            const pagenation = {
                offset: (page - 1) * pageSize || 0,
                limit: pageSize,
            };
            const filter = {
                postId,
                depth: 0,
            };
            const rootCommentList = JSON.parse(JSON.stringify(await commentRepository.getCommentList(filter, pagenation)));

            for (const comment of rootCommentList.rows) {
                convertComment(comment, blockUser);

                const filter = {
                    postId,
                    depth: 1,
                    parentId: comment.commentId,
                };
                comment.child = JSON.parse(JSON.stringify((await commentRepository.getCommentList(filter)).rows));
                const childCommentList = comment.child;

                for (const comment of childCommentList) {
                    convertComment(comment, blockUser);

                    const filter = {
                        postId,
                        depth: 2,
                        parentId: comment.commentId,
                    };
                    comment.child = JSON.parse(JSON.stringify((await commentRepository.getCommentList(filter)).rows));

                    comment.child.forEach(comment =>{
                        convertComment(comment, blockUser);
                    })
                }
            }

            const totalResults = await commentRepository.getCommentCount(postId);
            const totalPages = Math.ceil(rootCommentList.count / pageSize);

            const result = {
                totalResults,
                totalPages,
                comment: rootCommentList.rows,
            }

            return result;
        } catch (error) {
            console.log(error);
            throw new Error('Error get comment list ');
        }
    },

    updateComment: async (userId, commentId, content) => {
        try {
            return await commentRepository.updateComment(userId, commentId, content);
        } catch (error) {
            console.log(error);
            throw new Error('Error create comment');
        }
    },

    deleteComment: async (userId, commentId) => {
        try {
            return await commentRepository.deleteComment(userId, commentId);
        } catch (error) {
            console.log(error);
            throw new Error('Error create comment');
        }
    },
};
