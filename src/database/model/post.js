'use strict';
import { Sequelize } from "sequelize"; 

export const post = (sequelize, DataTypes) => {
    const Post = sequelize.define('post', {
        postId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        // userId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
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
        }
    }, {
        tableName: 'post',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Post.associate = (models) => {
        Post.belongsTo(models.User, { foreignKey: "userId", sourceKey: "userId" });
        
        Post.hasMany(models.Comment, { foreignKey: {
            name: "postId",
            allowNull: false
        }, sourceKey: "postId", onDelete: 'CASCADE' });
        
        Post.hasMany(models.Category, { foreignKey: {
            name: "postId",
            allowNull: false
        }, sourceKey: "postId", onDelete: 'CASCADE' });
        
        Post.hasMany(models.Bookmark, { foreignKey: {
            name: "postId",
            allowNull: false
        }, sourceKey: "postId", onDelete: 'CASCADE' });
        
        Post.hasMany(models.Image, { foreignKey: {
            name: "postId",
            allowNull: false
        }, sourceKey: "postId", onDelete: 'CASCADE' });
        
        Post.hasMany(models.Like, { foreignKey: {
            name: "postId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "postId", onDelete: 'CASCADE' });
    };
    return Post;
};