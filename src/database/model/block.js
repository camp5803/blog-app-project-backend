'use strict';

export const block = (sequelize, DataTypes) => {
    const Block = sequelize.define('block', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        // block_user_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
    }, {
        tableName: 'block',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Block.associate = (models) => {
        Block.belongsTo(models.User, { foreignKey: "block_user_id", sourceKey: "user_id" });
        Block.belongsTo(models.User, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id" });
    };
    return Block;
};