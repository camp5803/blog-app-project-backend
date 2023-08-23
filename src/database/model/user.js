'use strict';

export const user = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
        },
        login_type: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'user',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    User.associate = (db) => {};
    return User;
};