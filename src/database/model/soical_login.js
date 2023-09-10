'use strict';

export const socialLogin = (sequelize, DataTypes) => {
    const SocialLogin = sequelize.define('social_login', {
        social_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        // user_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        social_code: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        external_id: {
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
        SocialLogin.belongsTo(models.User, { foreignKey: "user_id", sourceKey: "user_id" });
    }
    return SocialLogin;
};