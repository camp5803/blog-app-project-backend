import { Sequelize } from "sequelize";
import configFromJson from "../../config.json" assert{ "type": "json" };
import { models } from "./model/index"

const env = process.env.NODE_ENV || 'development';
const config = configFromJson[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

Object.keys(models).forEach(modelName => {
    db[modelName] = models[modelName](sequelize, Sequelize);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
       db[modelName].associate(db);
    }
});

// // User 
// db.User.hasOne(db.Password, { foreignKey: 'user_id' });
// db.User.hasMany(db.Preference, { foreignKey: 'user_id' });
// db.User.hasMany(db.UserKeyword, { foreignKey: 'user_id' });

// db.User.hasMany(db.Block, { foreignKey: 'user_id' });
// db.Block.belongsTo(db.User, { foreignKey: 'block_user_id' });

// db.User.hasMany(db.Profile, { foreignKey: 'user_id' });
// db.User.hasMany(db.Neighbor, { foreignKey: 'user_id' });
// db.User.hasMany(db.SoicalLogin, { foreignKey: 'user_id' });
// db.User.hasMany(db.Post, { foreignKey: 'user_id' });
// db.User.hasMany(db.Category, { foreignKey: 'user_id' });
// db.User.hasMany(db.comment, { foreignKey: 'user_id' });
// db.User.hasMany(db.Bookmark, { foreignKey: 'user_id' });
// db.User.hasMany(db.Like, { foreignKey: 'user_id' });

// // UserKeyword
// db.UserKeyword.hasMany(db.Keyword, { foreignKey: 'user_id'});

// // Category
// db.Category.hasMany(db.Post, { foreignKey: 'catagory_id'});

// // Post
// db.Post.hasMany(db.Image, { foreignKey: 'post_id'});
// db.Post.hasMany(db.Like, { foreignKey: 'post_id'});
// db.Post.hasMany(db.comment, { foreignKey: 'post_id'});
// db.Post.hasMany(db.Bookmark, { foreignKey: 'post_id'});

// db.comment.hasMany(db.comment, { foreignKey: 'parent_id'});

export default db;