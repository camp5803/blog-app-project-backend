'use strict';

export const discussionImage = (sequelize, DataTypes) => {
    const DiscussionImage = sequelize.define('discussion_image', {
        imageId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        image: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        imageName: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
    }, {
        tableName: 'discussion_image',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    DiscussionImage.associate = (models) => {
        DiscussionImage.belongsTo(models.Discussion, { foreignKey: "discussionId", sourceKey: "discussionId" });
    };
    return DiscussionImage;
};
