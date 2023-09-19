'use strict';

export const password = (sequelize, DataTypes) => {
    const Password = sequelize.define('password', {
        passwordId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        // userId: {
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
        Password.belongsTo(models.User, { foreignKey: "userId", sourceKey: "userId" });
    };
    return Password;
};