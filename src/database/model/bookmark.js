'use strict';

export const bookmark = (sequelize, DataTypes) => {
    const Bookmark = sequelize.define('bookmark', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        tableName: 'bookmark',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Bookmark.associate = (models) => {
        Bookmark.belongsTo(models.User, { foreignKey: {
            name: "userId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId" });
        Bookmark.belongsTo(models.Post, { foreignKey: "postId", sourceKey: "postId" });
    };
    return Bookmark;
};