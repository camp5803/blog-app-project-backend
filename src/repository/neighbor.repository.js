import db from '@/database';
const { Neighbor, Profile } = db;

export const neighborRepository = {
    findFollowersByUserId: async (userId) => {
        return await Neighbor.findAll({
            where: { followsTo: userId },
            attribute: "userId",
            include: [{ 
                model: Profile,
                attributes: ["nickname", "imageUrl"],
                order: ["nickname", "DESC"]
            }],
            separate: true
        });
    },
    findFollowingsByUserId: async (userId) => {
        return await Neighbor.findAll({
            where: { userId },
            attribute: "userId",
            include: [{ 
                model: Profile,
                attributes: ["nickname", "imageUrl"],
                order: ["nickname", "DESC"]
            }],
            separate: true
        });
    },
    follow: async (id, targetId) => {
        return await Neighbor.create({
            userId: id,
            followsTo: targetId
        });
    },
    unFollow: async (id, targetId) => {
        return await Neighbor.delete({
            userId: id,
            followsTo: targetId
        });
    }
}