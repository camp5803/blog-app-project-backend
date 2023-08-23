'use strict';

export const neighbor = (sequelize, DataTypes) => {
    const Neighbor = sequelize.define('neighbor', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        follows_to: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        tableName: 'neighbor',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Neighbor.associate = (db) => {};
    return Neighbor;
};