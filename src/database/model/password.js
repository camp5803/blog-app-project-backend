'use strict';

export const password = (sequelize, DataTypes) => {
    const Password = sequelize.define('password', {
        password_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        // user_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        password: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
    }, {
        tableName: 'password',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Password.associate = (models) => {
        Password.belongsTo(models.User, { foreignKey: "user_id", sourceKey: "user_id" });
    };
    return Password;
};