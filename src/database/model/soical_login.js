'use strict';

export const socialLogin = (sequelize, DataTypes) => {
    const SocialLogin = sequelize.define('social_login', {
        socialId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        // userId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        socialCode: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        externalId: {
            type: DataTypes.STRING(30),
            allowNull: false,
        }
    }, {
        tableName: 'social_login',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    SocialLogin.associate = (models) => {
        SocialLogin.belongsTo(models.User, { foreignKey: "userId", sourceKey: "userId" });
    }
    return SocialLogin;
};