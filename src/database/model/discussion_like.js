'use strict';

export const discussionLike = (sequelize, DataTypes) => {
    const DiscussionLike = sequelize.define('discussion_like', {
        discussionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
    }, {
        tableName: 'discussion_like',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    DiscussionLike.associate = (models) => {
        DiscussionLike.belongsTo(models.User, { foreignKey: {
                name: "userId",
                primaryKey: true,
                allowNull: false
            }, sourceKey: "userId" });

        DiscussionLike.belongsTo(models.Discussion, { foreignKey: {
                name: "discussionId",
                primaryKey: true,
                allowNull: false
            }, sourceKey: "discussionId" });
    };
    return DiscussionLike;
};