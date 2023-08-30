import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { socialLoginRepository, userRepository } from '@/repository';

const socialCode = {
    KAKAO: 0,
    GOOGLE: 1,
    GITHUB: 2
};

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

const githubStrategyHandler = async (accessToken, refreshToken, profile, done) => {
    const socialUser = await socialLoginRepository.findBySocialId(profile.id);
    if (socialUser) {
        return done(null, socialUser);
    }
    const newSocialUser = await userRepository.createUser({
        email: profile._json.kakao_account_email,
        nickname: profile.displayName
    }, {
        type: socialCode.GITHUB, // createUser에 code type 분리 필요없을듯
        external_id: profile.id,
    });
    if (!newSocialUser) {
        return done({
            message: "[Login Error#6] Social login failed."
        }, false);
    }
    return done(null, newSocialUser); // 실패시 error 넘기는 done도 만들어야함
}

const githubPassport = new GithubStrategy(githubOptions, githubStrategyHandler)

export { githubPassport }