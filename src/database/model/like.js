'use strict';

export const like = (sequelize, DataTypes) => {
    const Like = sequelize.define('like', {
        postId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        // userId: {
        //     type: DataTypes.INTEGER,
        //     primaryKey: true,
        //     allowNull: false,
        // },
    }, {
        tableName: 'like',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Like.associate = (models) => {
        Like.belongsTo(models.User, { foreignKey: {
            name: "userId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId" });

        Like.belongsTo(models.Post, { foreignKey: {
            name: "postId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "postId" });
    };
    return Like;
};