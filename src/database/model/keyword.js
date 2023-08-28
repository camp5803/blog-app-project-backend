'use strict';

export const keyword = (sequelize, DataTypes) => {
    const Keyword = sequelize.define('keyword', {
        keyword_id: {
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
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Keyword.associate = (models) => {
        Keyword.hasMany(models.UserKeyword, { foreignKey: {
            name: "keyword_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "keyword_id", onDelete: 'CASCADE' });
    };
    return Keyword;
};