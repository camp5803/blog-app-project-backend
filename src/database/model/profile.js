'use strict';
import { Sequelize } from "sequelize"; 

export const profile = (sequelize, DataTypes) => {
    const Profile = sequelize.define('profile', {
        userId: {
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
        imageUrl: {
            type: DataTypes.STRING(200),
            allowNull: false,
            defaultValue: "https://julietlog.s3.ap-northeast-2.amazonaws.com/profile_img/default.png"
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true
        }
    }, {
        tableName: 'profile',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Profile.associate = (models) => {
        Profile.belongsTo(models.User, { foreignKey: "userId", sourceKey: "userId" });
        Profile.hasMany(models.Comment, { foreignKey: "userId" });
    }
    return Profile;
};