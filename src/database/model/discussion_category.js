'use strict';

export const discussionCategory = (sequelize, DataTypes) => {
    const DiscussionCategory = sequelize.define('discussion_category', {
        categoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        discussionId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
    }, {
        tableName: 'discussion_category',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    DiscussionCategory.associate = (models) => {
        DiscussionCategory.belongsTo(models.Discussion, { foreignKey: "discussionId", sourceKey: "discussionId" });
    };
    return DiscussionCategory;
};