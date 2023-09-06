import { profileRepository, socialLoginRepository, userRepository } from '@/repository';
import { createToken } from '@/utils'
import axios from 'axios';

const socialCode = {
    KAKAO: 1,
    GITHUB: 2,
    GOOGLE: 3
}

const Options = [null, { // 1번 index : KAKAO
    clientID: process.env.KAKAO_ID,
    clientSecret: process.env.KAKAO_SECRET,
    requestToken: 'https://kauth.kakao.com/oauth/token',
    profile: 'https://kapi.kakao.com/v2/user/me',
}, { // 2번 index : GITHUB
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    requestToken: 'https://github.com/login/oauth/access_token',
    profile: 'https://api.github.com/user',
}, { // 3번 index : GOOGLE
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    requestToken: 'https://oauth2.googleapis.com/token',
    profile: 'https://www.googleapis.com/userinfo/v2/me',
}];

export const socialLoginService = {
    login: async (type, code, uri) => { // type에 .toUpperCase 사용해서 전달하기
        let profile, email;
        type = socialCode[type];
        try {
            const socialToken = await axios.post(Options[type].requestToken, null, {
                params: {
                    code,
                    client_id: Options[type].clientID,
                    client_secret: Options[type].clientSecret,
                    redirect_uri: uri,
                    ...(type === "GITHUB" ? {} : { grant_type: 'authorization_code' })
                }
            });
            const socialProfile = await axios.get(Options[type].profile, {
                headers: {
                    'Authorization': `Bearer ${type === "GITHUB" ?
                        new URLSearchParams(socialToken.data).get('access_token') : socialToken.data.access_token}`
                }
            });
            const user = await socialLoginRepository.findBySocialId(socialProfile.data.id);
            profile = await profileRepository.findUserInformationById(user.user_id);
            email = userRepository.findEmailByUserId(user.user_id);
            if (!user) {
                const newUser = await socialLoginRepository.createSocialUser(socialProfile.data, type);
                profile = await profileRepository.findUserInformationById(newUser.user_id);
                email = newUser.dataValues.email;
            }
            const userToken = await createToken(user.user_id);
            return {
                token: userToken,
                profile : {
                    nickname: profile.nickname,
                    image_url: profile.image_url,
                    email
                }
            }
        } catch (error) {
            return { message: error.message }
        }
    },
}