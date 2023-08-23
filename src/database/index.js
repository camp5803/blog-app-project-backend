import { Sequelize } from "sequelize";
import configFromJson from "../../config.json" assert{ "type": "json" };
import { user } from "./model/user"
import { userKeyword } from "./model/user_keyword";
import { soicalLogin } from "./model/soical_login";
import { profile } from "./model/profile";
import { preference } from "./model/preference";
import { post } from "./model/post";
import { password } from "./model/password";
import { neighbor } from "./model/neighbor";
import { like } from "./model/like";
import { keyword } from "./model/keyword";
import { image } from "./model/image";
import { comment } from "./model/comment";
import { category } from "./model/category";
import { bookmark } from "./model/bookmark";
import { block } from "./model/block";

const env = process.env.NODE_ENV || 'development';
const config = configFromJson[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.User = user(sequelize, Sequelize);
db.UserKeyword = userKeyword(sequelize, Sequelize);
db.SoicalLogin = soicalLogin(sequelize, Sequelize);
db.Profile = profile(sequelize, Sequelize);
db.Preference = preference(sequelize, Sequelize);
db.Post = post(sequelize, Sequelize);
db.Password = password(sequelize, Sequelize);
db.Neighbor = neighbor(sequelize, Sequelize);
db.Like = like(sequelize, Sequelize);
db.Keyword = keyword(sequelize, Sequelize);
db.Image = image(sequelize, Sequelize);
db.comment = comment(sequelize, Sequelize);
db.Category = category(sequelize, Sequelize);
db.Bookmark = bookmark(sequelize, Sequelize);
db.Block = block(sequelize, Sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Object.keys(db).forEach(modelName => {
//     if (db[modelName].associate) {
//         db[modelName].associate(db);
//     }
// });

export default db;