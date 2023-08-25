'use strict';

export const like = (sequelize, DataTypes) => {
    const Like = sequelize.define('like', {
        // post_id: {
        //     type: DataTypes.INTEGER,
        //     primaryKey: true,
        //     allowNull: false,
        // },
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

    Like.associate = (db) => {};
    return Like;
};