'use strict';
import { Sequelize } from "sequelize"; 

export const comment = (sequelize, DataTypes) => {
    const Comment = sequelize.define('comment', {
        commentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // userId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        // parentId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        content: {
            type: DataTypes.TEXT('tiny'),
            allowNull: false
        },
        depth: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },
        order: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },
        isDeleted:{
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
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
        deletedAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true
        }
    }, {
        tableName: 'comment',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Comment.associate = (models) => {
        Comment.hasMany(models.Comment, { foreignKey: {
            name: "parentId",
            defaultValue: null,
            allowNull: true
        }, sourceKey: "commentId" });
        Comment.belongsTo(models.User, { foreignKey: "userId", sourceKey: "userId" });
        Comment.belongsTo(models.Post, { foreignKey: "postId", sourceKey: "postId" });
        Comment.belongsTo(models.Profile, { foreignKey: "userId" });
    };
    return Comment;
};