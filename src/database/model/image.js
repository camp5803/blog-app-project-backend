'use strict';

export const image = (sequelize, DataTypes) => {
    const Image = sequelize.define('image', {
        image_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        // post_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        image: {
            type: DataTypes.TEXT('long'),
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

    Image.associate = (models) => {
        Image.belongsTo(models.Post, { foreignKey: "post_id", sourceKey: "post_id" });
    };
    return Image;
};
