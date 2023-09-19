'use strict';

export const category = (sequelize, DataTypes) => {
    const Category = sequelize.define('category', {
        categoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
    }, {
        tableName: 'category',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Category.associate = (models) => {
        Category.belongsTo(models.Post, { foreignKey: "postId", sourceKey: "postId" });
    };
    return Category;
};