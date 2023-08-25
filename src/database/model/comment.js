'use strict';
import { Sequelize } from "sequelize"; 

export const comment = (sequelize, DataTypes) => {
    const Comment = sequelize.define('comment', {
        comment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // user_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        // parent_id: {
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
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true
        },
        deleted_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true
        }
    }, {
        tableName: 'comment',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Comment.associate = (db) => {
        Comment.hasMany(models.Comment, { foreignKey: {
            name: "parent_id",
            defaultValue: null,
            allowNull: true
        }, sourceKey: "comment_id" });
    };
    return Comment;
};