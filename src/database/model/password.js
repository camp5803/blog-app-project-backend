'use strict';

export const password = (sequelize, DataTypes) => {
    const Password = sequelize.define('password', {
        password_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        // user_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        password: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
    }, {
        tableName: 'password',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Password.associate = (db) => {};
    return Password;
};