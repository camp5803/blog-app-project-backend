'use strict';

export const block = (sequelize, DataTypes) => {
    const Block = sequelize.define('block', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        // blockUserId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
    }, {
        tableName: 'block',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Block.associate = (models) => {
        Block.belongsTo(models.User, { foreignKey: {
            name: "blockUserId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId" });
        Block.belongsTo(models.User, { foreignKey: {
            name: "userId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId" });
    };
    return Block;
};