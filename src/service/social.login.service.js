import { socialLoginRepository, userRepository } from '@/repository/index';
import { createToken } from '@/utils/index'
import axios from 'axios';

const socialCode = {
    KAKAO: 1,
    GITHUB: 2,
    GOOGLE: 3
}

const githubOptions = {
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: `http://${process.env.SERVER_URL}:${process.env.PORT || 8280}/api/auth/callback/github`
}
const googleOptions = {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `http://${process.env.SERVER_URL}:${process.env.PORT || 8280}/api/auth/callback/google`
}
const kakaoOptions = {
    clientID: process.env.KAKAO_ID,
    clientSecret: process.env.KAKAO_SECRET,
    callbackURL: `http://${process.env.SERVER_URL}:${process.env.PORT || 8280}/api/auth/callback/kakao`
}

export const socialLoginService = {
    kakaoLoginService: async (code) => {
        try {
            const token = await axios.post('https://kauth.kakao.com/oauth/token', null, {
                params: {
                    code,
                    client_id: kakaoOptions.clientID,
                    redirect_url: kakaoOptions.callbackURL,
                    grant_type: 'authorization_code'
                }
            });
            const kakaoUser = await axios.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    'Authorization': `Bearer ${token.data.access_token}`
                }
            });
            if (!kakaoUser) {
                return { error: "" }
            }
            const user = await socialLoginRepository.findBySocialId(kakaoUser.data.id);
            if (!user) {
                const newUser = await socialLoginRepository.createSocialUser({
                    email: kakaoUser.data.kakao_account.email || null,
                    type: socialCode.KAKAO,
                    id: kakaoUser.data.id,
                    image_url: kakaoUser.data.kakao_account.profile.profile_image_url
                });
                return await createToken(newUser.user_id);
            }
            return await createToken(user.user_id);
        } catch (error) {
            return { error };
        }
    },
    githubLoginService: async (code) => {
        try {
            const token = await axios.post('https://github.com/login/oauth/access_token', null, {
                params: {
                    code,
                    client_id: githubOptions.clientID,
                    client_secret: githubOptions.clientSecret,
                    redirect_url: githubOptions.callbackURL,
                }
            });
            const tokenData = new URLSearchParams(token.data);
            const githubUser = await axios.get('https://api.github.com/user', {
                headers: {
                    'Authorization': `Bearer ${tokenData.get('access_token')}`
                }
            });
            if (!githubUser) {
                return { error: "" }
            }
            const user = await socialLoginRepository.findBySocialId(githubUser.id);
            if (!user) {
                const newUser = await socialLoginRepository.createSocialUser({
                    email: githubUser.data.email || null,
                    type: socialCode.GITHUB,
                    id: githubUser.data.id,
                    image_url: githubUser.data.avatar_url
                });
                return await createToken(newUser.user_id);
            }
            return await createToken(user.user_id);
        } catch (error) {
            return { error };
        }
    },
    googleLoginService: async (token) => {
        try {
            const googleUser = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });            
            const user = await socialLoginRepository.findBySocialId(googleUser.id);
            if (user) {
                return await createToken(user.user_id);
            }
            // 요기에 createUser 해줘야댐
        } catch (error) {
            return { error };
        }
    }
}