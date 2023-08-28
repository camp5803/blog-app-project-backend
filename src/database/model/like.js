'use strict';

export const like = (sequelize, DataTypes) => {
    const Like = sequelize.define('like', {
        post_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        // user_id: {
        //     type: DataTypes.INTEGER,
        //     primaryKey: true,
        //     allowNull: false,
        // },
    }, {
        tableName: 'like',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Like.associate = (models) => {
        Like.belongsTo(models.User, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id" });

        Like.belongsTo(models.Post, { foreignKey: {
            name: "post_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "post_id" });
    };
    return Like;
};