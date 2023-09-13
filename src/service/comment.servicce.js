import {commentRepository} from '@/repository/comment.repository';

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
                comment.isBlocked = blockUser.includes(comment.userId);
                comment.nickname = comment.profile.nickname;
                delete comment.profile;

                const filter = {
                    postId,
                    depth: 1,
                    parentId: comment.commentId,
                };
                comment.child = JSON.parse(JSON.stringify((await commentRepository.getCommentList(filter)).rows));
                const childCommentList = comment.child;

                for (const comment of childCommentList) {
                    comment.isBlocked = blockUser.includes(comment.userId);
                    comment.nickname = comment.profile.nickname;
                    delete comment.profile;

                    const filter = {
                        postId,
                        depth: 2,
                        parentId: comment.commentId,
                    };
                    comment.child = JSON.parse(JSON.stringify((await commentRepository.getCommentList(filter)).rows));

                    comment.child.forEach(comment =>{
                        comment.isBlocked = blockUser.includes(comment.userId);
                        comment.nickname = comment.profile.nickname;
                        delete comment.profile;
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
};