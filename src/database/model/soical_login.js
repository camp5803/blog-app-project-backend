'use strict';

export const soicalLogin = (sequelize, DataTypes) => {
    const SocialLogin = sequelize.define('social_login', {
        social_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        social_code: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        external_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'social_login',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    SocialLogin.associate = (db) => {};
    return SocialLogin;
};