'use strict';

export const image = (sequelize, DataTypes) => {
    const Image = sequelize.define('image', {
        image_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        image_name: {
            type: DataTypes.STRING(45),
            allowNull: true,
        }
    }, {
        tableName: 'image',
        // sequelize,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Image.associate = (db) => {};
    return Image;
};