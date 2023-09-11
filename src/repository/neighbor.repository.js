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
    findFollowingByUserId: async (userId) => {
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
    }
}