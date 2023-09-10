'use strict';

export const keyword = (sequelize, DataTypes) => {
    const Keyword = sequelize.define('keyword', {
        keywordId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        keyword: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        },
    }, {
        tableName: 'keyword',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Keyword.associate = (models) => {
        Keyword.hasMany(models.UserKeyword, { foreignKey: {
            name: "keywordId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "keywordId", onDelete: 'CASCADE' });
    };
    return Keyword;
};