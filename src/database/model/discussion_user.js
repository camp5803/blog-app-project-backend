'use strict';

export const discussionUser = (sequelize, DataTypes) => {
    const DiscussionUser = sequelize.define('discussion_user', {
        discussionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        isBanned:{
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        elapsedTime: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'discussion_user',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    DiscussionUser.associate = (models) => {
        DiscussionUser.belongsTo(models.User, { foreignKey: "userId", sourceKey: "userId" });
        DiscussionUser.belongsTo(models.Discussion, { foreignKey: "discussionId", sourceKey: "discussionId" });
    };
    return DiscussionUser;
};