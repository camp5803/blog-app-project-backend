'use strict';

export const preference = (sequelize, DataTypes) => {
    const Preference = sequelize.define('preference', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        darkmode_status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        neighbor_alert: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        comment_alert: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        chat_alert: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
    }, {
        tableName: 'preference',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Preference.associate = (models) => {
        Preference.belongsTo(models.User, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id" });
    };
    return Preference;
};