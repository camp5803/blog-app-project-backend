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
        User.hasOne(models.SocialLogin, { foreignKey: "user_id", sourceKey: "user_id" });
        User.hasOne(models.Password, { foreignKey: "user_id", sourceKey: "user_id" });
        
        User.hasMany(models.Neighbor, { foreignKey: "follows_to", sourceKey: "user_id" });
        User.hasMany(models.Comment, { foreignKey: "follows_to", sourceKey: "user_id" });
        User.hasMany(models.Block, { foreignKey: "block_user_id", sourceKey: "user_id" });
        User.hasMany(models.Post, { foreignKey: "user_id", sourceKey: "user_id" });

        // FK이면서 PK인 컬럼들에 대한 추가 설정 : primaryKey: true
        User.hasOne(models.Preference, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id" });
        
        User.hasOne(models.Profile, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id" });

        User.hasMany(models.Bookmark, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id" });

        User.hasMany(models.Block, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id" });

        User.hasMany(models.Neighbor, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id" });

        User.hasMany(models.UserKeyword, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id" });

        User.hasMany(models.Like, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id" });
    };
    return User;
};