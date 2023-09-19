import { profileRepository, socialLoginRepository, userRepository } from '@/repository';
import { createToken } from '@/utils';
import { customError } from '@/common/error';
import { StatusCodes } from 'http-status-codes';
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
    login: async (type, code, uri) => { // type과 code 검증하기, 로그인 회원가입 로직 분리하기
        const numbericType = socialCode[type];
        try {
            const socialToken = await axios.post(Options[numbericType].requestToken, null, {
                params: {
                    code,
                    client_id: Options[numbericType].clientID,
                    client_secret: Options[numbericType].clientSecret,
                    redirect_uri: uri,
                    ...(numbericType === socialCode.GITHUB ? {} : { grant_type: 'authorization_code' })
                }
            });
            const socialProfile = await axios.get(Options[numbericType].profile, {
                headers: {
                    'Authorization': `Bearer ${numbericType === socialCode.GITHUB ?
                        new URLSearchParams(socialToken.data).get('access_token') : socialToken.data.access_token}`
                }
            });
            const user = await socialLoginRepository.findBySocialId(socialProfile.data.id);
            if (user) {
                const profile = await profileRepository.findUserInformationById(user.userId);
                const email = await userRepository.findEmailByUserId(user.userId);
                const userToken = await createToken(user.userId);
                return {
                    token: userToken,
                    profile : {
                        nickname: profile.nickname,
                        imageUrl: profile.imageUrl,
                        darkmode: profile.darkmode,
                        email: email.dataValues.email
                    }
                }
            }
            const newUser = await socialLoginRepository.createSocialUser(socialProfile.data, type);
            const profile = await profileRepository.findUserInformationById(newUser.userId);
            const email = newUser.dataValues.email;
            const userToken = await createToken(newUser.userId);
            return {
                token: userToken,
                profile : {
                    nickname: profile.nickname,
                    imageUrl: profile.imageUrl,
                    darkmode: profile.darkmode,
                    email
                }
            }
        } catch (error) {
            throw customError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    },
}