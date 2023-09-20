'use strict';

export const discussionBookmark = (sequelize, DataTypes) => {
    const DiscussionBookmark = sequelize.define('discussion_bookmark', {
        discussionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
    }, {
        tableName: 'discussion_bookmark',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    DiscussionBookmark.associate = (models) => {
        DiscussionBookmark.belongsTo(models.User, { foreignKey: {
                name: "userId",
                primaryKey: true,
                allowNull: false
            }, sourceKey: "userId" });
        DiscussionBookmark.belongsTo(models.Discussion, { foreignKey: {
                name: "discussionId",
                primaryKey: true,
                allowNull: false
            }, sourceKey: "discussionId" });
    };
    return DiscussionBookmark;
};