import db from '@/database';
const { Neighbor, Profile } = db;
import { Op } from 'sequelize';

export const neighborRepository = { // 이거 고쳐야함
    findFollowersUserIds: async (userId) => {
        return await Neighbor.findAll({
            where: { followsTo: userId },
            attributes: ['userId'],
        });
    },
    findFollowingUserIds: async (userId) => {
        return await Neighbor.findAll({
            where: { userId },
            attributes: ['followsTo']
        });
    },
    findProfileByUserIds: async (userIds) => {
        return await Profile.findAll({
            where: { userId: { [Op.in]: userIds }},
            attributes: ['userId', 'nickname', 'imageUrl']
        })
    },
    findNeighborCounts: async (userId) => {
        const following = await Neighbor.count({ where: { userId }});
        const follower = await Neighbor.count({ where: { followsTo: userId }});
        return { following, follower }
    },
    follow: async (id, targetId) => {
        return await Neighbor.create({
            userId: id,
            followsTo: targetId
        });
    },
    unfollow: async (id, targetId) => {
        return await Neighbor.destroy({
            where: {
                userId: id,
                followsTo: targetId
            }
        });
    },
    isFollowing: async (userId, targetId) => {
        return await Neighbor.findOne({
            where: { userId, followsTo: targetId }
        });
    }
}