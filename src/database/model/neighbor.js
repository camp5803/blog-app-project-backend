'use strict';

export const neighbor = (sequelize, DataTypes) => {
    const Neighbor = sequelize.define('neighbor', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        // follows_to: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
    }, {
        tableName: 'neighbor',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Neighbor.associate = (models) => {
        Neighbor.belongsTo(models.User, { foreignKey: "follows_to", sourceKey: "user_id" });
        Neighbor.belongsTo(models.User, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id" });
    };
    return Neighbor;
};