'use strict';
import { Sequelize } from "sequelize";

export const discussion = (sequelize, DataTypes) => {
    const Discussion = sequelize.define('discussion', {
        discussionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        view: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },
        like: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
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
        },
        thumbnail: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        startTime:{
            type: DataTypes.DATE,
            allowNull: false
        },
        endTime:{
            type: DataTypes.DATE,
            allowNull: false
        },
        capacity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: 100
        },
        progress:{
            type: DataTypes.TEXT('long'),
            allowNull: true
        }
    }, {
        tableName: 'discussion',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Discussion.associate = (models) => {
        Discussion.belongsTo(models.User, { foreignKey: "userId", sourceKey: "userId" });


        Discussion.hasMany(models.DiscussionCategory, { foreignKey: {
                name: "discussionId",
                allowNull: false
            }, sourceKey: "discussionId", onDelete: 'CASCADE' });

        Discussion.hasMany(models.DiscussionImage, { foreignKey: {
                name: "discussionId",
                allowNull: false
            }, sourceKey: "discussionId", onDelete: 'CASCADE' });

        Discussion.hasMany(models.DiscussionLike, { foreignKey: {
                name: "discussionId",
                primaryKey: true,
                allowNull: false
            }, sourceKey: "discussionId", onDelete: 'CASCADE' });

        Discussion.hasMany(models.DiscussionUser, { foreignKey: {
                name: "discussionId",
                primaryKey: true,
                allowNull: false
            }, sourceKey: "discussionId", onDelete: 'CASCADE' });
    };
    return Discussion;
};