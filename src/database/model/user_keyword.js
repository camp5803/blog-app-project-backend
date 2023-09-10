'use strict';

export const userKeyword = (sequelize, DataTypes) => {
    const UserKeyword = sequelize.define('user_keyword', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        keywordId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
    }, {
        tableName: 'user_keyword',
        underscored: true,
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    UserKeyword.associate = (models) => {
        UserKeyword.belongsTo(models.User, { foreignKey: {
            name: "userId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "userId" });
        UserKeyword.belongsTo(models.Keyword, { foreignKey: {
            name: "keywordId",
            primaryKey: true,
            allowNull: false
        }, sourceKey: "keywordId" });
    };
    return UserKeyword;
};