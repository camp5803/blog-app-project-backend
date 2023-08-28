import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { userRepository } from '@/repository'
import { socialLoginRepository } from '@/repository';
import { createPassword } from '@/utils/index'

const socialCode = {
    KAKAO: 0,
    GOOGLE: 1,
    GITHUB: 2
};

export default () => {
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.PUBLIC_KEY
    };
    const localOptions = {
        usernameField: 'email',
        passwordField: 'password'
    };
    const githubOptions = {
        clientID: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: `http://${process.env.SERVER_URL}/api/auth/login?login_type=github`
    }
    const googleOptions = {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: `http://${process.env.SERVER_URL}/api/auth/login?login_type=google`
    }
    const kakaoOptions = {
        clientID: process.env.KAKAO_ID,
        clientSecret: process.env.KAKAO_SECRET,
        callbackURL: `http://${process.env.SERVER_URL}/api/auth/login?login_type=kakao`
    }
    
    const verifyUser = async (payload, done) => {
        if (payload.password) {
            const user = userRepository.findByEmail(payload.email);
            return await userRepository.findByPassword({
                user_id: user.user_id,
                email: payload.email, 
                password: createPassword(payload.password) 
            });
        }
        return await userRepository.findByUserId(payload.user_id);
    };
    
    const strategyHandler = async (email, password, done) => {
        const user = await verifyUser({ email, password });
        try {
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    }

    const socialStrategyHandler = async (accessToken, refreshToken, profile, done) => {
        const user = await userRepository.findByEmail(profile.email);
        if (user) {
            user.socialId = profile.id;
            user.save();
            return done(null, user);
        }
        const createdUser = await userRepository.createUser({
            email: profile.email,
            nickname: profile.name
        }, {
            login_type: socialCode.GITHUB,
            external_id: profile.id
        });
        if (createdUser.error) {
            return done(createdUser.message, false);
        }
        return done(null, createdUser);
    }
    
    passport.use(new LocalStrategy(localOptions, strategyHandler));
    passport.use(new JwtStrategy(jwtOptions, strategyHandler));
    passport.use(new GithubStrategy(githubOptions, socialStrategyHandler));
}