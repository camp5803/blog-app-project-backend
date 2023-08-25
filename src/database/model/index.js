import { user } from "./user"
import { userKeyword } from "./user_keyword";
import { socialLogin } from "./soical_login";
import { profile } from "./profile";
import { preference } from "./preference";
import { post } from "./post";
import { password } from "./password";
import { neighbor } from "./neighbor";
import { like } from "./like";
import { keyword } from "./keyword";
import { image } from "./image";
import { comment } from "./comment";
import { category } from "./category";
import { bookmark } from "./bookmark";
import { block } from "./block";

export const models = {
    User: user,
    UserKeyword: userKeyword,
    SocialLogin: socialLogin,
    Profile: profile,
    Preference: preference,
    Post: post,
    Password: password,
    Neighbor: neighbor,
    Like: like,
    Keyword: keyword,
    Image: image,
    Comment: comment,
    Category: category,
    Bookmark: bookmark,
    Block: block
}