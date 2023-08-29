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
        nickname: {
            type: DataTypes.STRING(45),
            allowNull: true,
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

    User.associate = (models) => {
        // 생성될 관계 컬럼들에 대한 attribute 제공
        User.hasOne(models.SocialLogin, { foreignKey: {
            name: "user_id",
            allowNull: false
        }, sourceKey: "user_id", onDelete: 'CASCADE' });
        
        User.hasOne(models.Password, { foreignKey: {
            name: "user_id",
            allowNull: false
        }, sourceKey: "user_id", onDelete: 'CASCADE' });
        
        User.hasMany(models.Neighbor, { foreignKey: {
            name: "follows_to",
            allowNull: false
        }, sourceKey: "user_id", onDelete: 'CASCADE' });
        
        User.hasMany(models.Comment, { foreignKey: {
            name: "user_id",
            allowNull: false
        }, sourceKey: "user_id", onDelete: 'CASCADE' });
        
        User.hasMany(models.Block, { foreignKey: {
            name: "block_user_id",
            allowNull: false
        }, sourceKey: "user_id", onDelete: 'CASCADE' });
        
        User.hasMany(models.Post, { foreignKey: {
            name: "user_id",
            allowNull: false
        }, sourceKey: "user_id", onDelete: 'CASCADE' });

        User.hasOne(models.Preference, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id", onDelete: 'CASCADE' });

        User.hasOne(models.Profile, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id", onDelete: 'CASCADE' });

        User.hasMany(models.Bookmark, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id", onDelete: 'CASCADE' });

        User.hasMany(models.Block, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id", onDelete: 'CASCADE' });

        User.hasMany(models.Neighbor, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id", onDelete: 'CASCADE' });

        User.hasMany(models.UserKeyword, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id", onDelete: 'CASCADE' });

        User.hasMany(models.Like, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id", onDelete: 'CASCADE' });
    };
    return User;
};