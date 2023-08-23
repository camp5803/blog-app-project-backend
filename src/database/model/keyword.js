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

    Keyword.associate = (db) => {};
    return Keyword;
};