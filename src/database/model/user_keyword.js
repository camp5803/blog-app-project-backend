'use strict';

export const userKeyword = (sequelize, DataTypes) => {
    const UserKeyword = sequelize.define('user_keyword', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        keyword_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
    }, {
        tableName: 'user_keyword',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    UserKeyword.associate = (models) => {
        UserKeyword.belongsTo(models.User, { foreignKey: {
            name: "user_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "user_id" });
        UserKeyword.belongsTo(models.Keyword, { foreignKey: {
            name: "keyword_id",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "keyword_id" });
    };
    return UserKeyword;
};