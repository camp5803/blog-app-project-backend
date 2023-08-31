'use strict';
import { Sequelize } from "sequelize"; 

export const post = (sequelize, DataTypes) => {
    const Post = sequelize.define('post', {
        post_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        // user_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        title: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
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
        tableName: 'post',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Post.associate = (models) => {
        Post.belongsTo(models.User, { foreignKey: "user_id", sourceKey: "user_id" });
        
        Post.hasMany(models.Comment, { foreignKey: {
            name: "post_id",
            allowNull: false
        }, sourceKey: "post_id", onDelete: 'CASCADE' });
        
        Post.hasMany(models.Category, { foreignKey: {
            name: "post_id",
            allowNull: false
        }, sourceKey: "post_id", onDelete: 'CASCADE' });
        
        Post.hasMany(models.Bookmark, { foreignKey: {
            name: "post_id",
            allowNull: false
        }, sourceKey: "post_id", onDelete: 'CASCADE' });
        
        Post.hasMany(models.Image, { foreignKey: {
            name: "post_id",
            allowNull: false
        }, sourceKey: "post_id", onDelete: 'CASCADE' });
        
        Post.hasMany(models.Like, { foreignKey: {
            name: "post_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "post_id", onDelete: 'CASCADE' });
    };
    return Post;
};