'use strict';

export const block = (sequelize, DataTypes) => {
    const Block = sequelize.define('block', {
        // user_id: {
        //     type: DataTypes.INTEGER,
        //     primaryKey: true,
        //     allowNull: false,
        // },
        // block_user_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
    }, {
        tableName: 'block',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Block.associate = (db) => {};
    return Block;
};