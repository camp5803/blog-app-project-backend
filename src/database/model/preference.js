'use strict';

export const preference = (sequelize, DataTypes) => {
    const Preference = sequelize.define('preference', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        darkmodeStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        neighborAlert: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        commentAlert: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        chatAlert: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        setNeighborPrivate: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        }
    }, {
        tableName: 'preference',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Preference.associate = (models) => {
        Preference.belongsTo(models.User, { foreignKey: {
            name: "userId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId" });
    };
    return Preference;
};