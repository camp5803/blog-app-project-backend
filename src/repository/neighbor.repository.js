import db from '@/database';
const { Neighbor, Profile, User } = db;

export const neighborRepository = { // 이거 고쳐야함
    findFollowersByUserId: async (userId) => {
        return await Neighbor.findAll({
            where: { followsTo: userId },
            attribute: "followsTo",
            include: [{
                model: User,
                attributes: [],
                include: [{
                    model: Profile,
                    attributes: ["nickname", "image_url"],
                    required: true
                }]
            }],
            order: [[
                { model: User, as: 'user' }, 
                { model: Profile, as: 'profile' }, 
                'nickname', 'ASC'
            ]], 
            raw: true
        });
    },
    findFollowingsByUserId: async (userId) => {
        return await Neighbor.findAll({
            where: { userId },
            attribute: "followsTo",
            include: [{
                model: User,
                attributes: [],
                include: [{
                    model: Profile,
                    attributes: ["nickname", "image_url"],
                    required: true
                }]
            }],
            order: [[
                { model: User, as: 'user' }, 
                { model: Profile, as: 'profile' }, 
                'nickname', 'ASC'
            ]], 
            raw: true
        });
    },
    follow: async (id, targetId) => {
        return await Neighbor.create({
            userId: id,
            followsTo: targetId
        });
    },
    unfollow: async (id, targetId) => {
        return await Neighbor.delete({
            userId: id,
            followsTo: targetId
        });
    },
    isFollowing: async (userId, targetId) => {
        return await Neighbor.findOne({
            where: { userId, followsTo: targetId }
        });
    }
}