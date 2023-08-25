'use strict';

export const keyword = (sequelize, DataTypes) => {
    const Keyword = sequelize.define('keyword', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        keyword_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
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
        Keyword.belongsTo(models.UserKeyword, { foreignKey: {
            name: "keyword_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "keyword_id" });
    };
    return Keyword;
};