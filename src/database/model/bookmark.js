'use strict';

export const bookmark = (sequelize, DataTypes) => {
    const Bookmark = sequelize.define('bookmark', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        // post_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
    }, {
        tableName: 'bookmark',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Bookmark.associate = (models) => {
        Bookmark.belongsTo(models.User, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id" });
        Bookmark.belongsTo(models.Post, { foreignKey: "post_id", sourceKey: "post_id" });
    };
    return Bookmark;
};