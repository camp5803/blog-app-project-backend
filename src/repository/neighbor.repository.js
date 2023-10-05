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
            attributes: ['follows_to']
        });
    },
    findProfileByUserIds: async (userIds) => {
        return await Profile.findAll({
            where: { userId: { [Op.in]: userIds }},
            attributes: ['userId', 'nickname', 'imageUrl']
        })
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