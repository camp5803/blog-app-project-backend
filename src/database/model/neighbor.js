'use strict';

export const neighbor = (sequelize, DataTypes) => {
    const Neighbor = sequelize.define('neighbor', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        followsTo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        tableName: 'neighbor',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Neighbor.associate = (models) => {
        Neighbor.belongsTo(models.User, { foreignKey: {
            name: "followsTo",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId" });
        Neighbor.belongsTo(models.User, { foreignKey: {
            name: "userId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId" });
    };
    return Neighbor;
};