'use strict';
import { Sequelize } from "sequelize"; 

export const profile = (sequelize, DataTypes) => {
    const Profile = sequelize.define('profile', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        nickname: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        },
        image_url: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT('tiny'),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true
        }
    }, {
        tableName: 'profile',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Profile.associate = (db) => {}
    return Profile;
};