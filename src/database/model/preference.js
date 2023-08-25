'use strict';

export const preference = (sequelize, DataTypes) => {
    const Preference = sequelize.define('preference', {
        // user_id: {
        //     type: DataTypes.INTEGER,
        //     primaryKey: true,
        //     allowNull: false,
        // },
        darkmode_status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        neighbor_alert: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        comment_alert: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        chat_alert: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    }, {
        tableName: 'preference',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Preference.associate = (db) => {};
    return Preference;
};