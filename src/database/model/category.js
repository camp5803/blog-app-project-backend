'use strict';

export const category = (sequelize, DataTypes) => {
    const Category = sequelize.define('category', {
        category_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
    }, {
        tableName: 'category',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Category.associate = (db) => {};
    return Category;
};