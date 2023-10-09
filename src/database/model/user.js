'use strict';

export const user = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: true,
            unique: true,
        },
        loginType: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'user',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    User.associate = (models) => {
        // 생성될 관계 컬럼들에 대한 attribute 제공
        User.hasOne(models.SocialLogin, { foreignKey: {
            name: "userId",
            allowNull: false
        }, sourceKey: "userId", onDelete: 'CASCADE' });
        
        User.hasOne(models.Password, { foreignKey: {
            name: "userId",
            allowNull: false
        }, sourceKey: "userId", onDelete: 'CASCADE' });
        
        User.hasMany(models.Neighbor, { foreignKey: {
            name: "followsTo",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId", onDelete: 'CASCADE' });
        
        User.hasMany(models.Comment, { foreignKey: {
            name: "userId",
            allowNull: false
        }, sourceKey: "userId", onDelete: 'CASCADE' });
        
        User.hasMany(models.Block, { foreignKey: {
            name: "blockUserId",
            allowNull: false
        }, sourceKey: "userId", onDelete: 'CASCADE' });
        
        User.hasMany(models.Post, { foreignKey: {
            name: "userId",
            allowNull: false
        }, sourceKey: "userId", onDelete: 'CASCADE' });

        User.hasOne(models.Preference, { foreignKey: {
            name: "userId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId", onDelete: 'CASCADE' });

        User.hasOne(models.Profile, { foreignKey: {
            name: "userId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId", onDelete: 'CASCADE' });

        User.hasMany(models.Bookmark, { foreignKey: {
            name: "userId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId", onDelete: 'CASCADE' });

        User.hasMany(models.Block, { foreignKey: {
            name: "userId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId", onDelete: 'CASCADE' });

        User.hasMany(models.Neighbor, { foreignKey: {
            name: "userId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId", onDelete: 'CASCADE' });

        User.hasMany(models.UserKeyword, { foreignKey: {
            name: "userId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId", onDelete: 'CASCADE' });

        User.hasMany(models.Like, { foreignKey: {
            name: "userId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId", onDelete: 'CASCADE' });

        User.hasMany(models.DiscussionUser, { foreignKey: {
                name: "userId",
                primaryKey: true,
                allowNull: false
        }, sourceKey: "userId", onDelete: 'CASCADE' });
    };
    return User;
};