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

export default db;