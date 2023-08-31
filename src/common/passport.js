import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { userRepository } from '@/repository'
import { passwordRepository } from '@/repository';
import { githubPassport } from '@/common/passport-social';
import bcrypt from 'bcrypt';

export default () => {
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.PUBLIC_KEY
    };
    const localOptions = {
        usernameField: 'email',
        passwordField: 'password'
    };
    
    const verifyUser = async (payload) => {
        if (payload.password) {
            const user = await userRepository.findByEmail(payload.email);
            const password = await passwordRepository.findByUserId({
                user_id: user.user_id,
            });

            if (bcrypt.compareSync(payload.password, password.password)) {
                return user;
            }
            return null;
        }
        return await userRepository.findByUserId(payload.user_id);
    };
    
    const strategyHandler = async (email, password, done) => {
        try {
            const user = await verifyUser({ email, password });
            if (user) {
                return done(null, user);
            }
            return done(true, false);
        } catch (error) {
            return done(error, false);
        }
    }
    
    passport.use(new LocalStrategy(localOptions, strategyHandler));
    passport.use(new JwtStrategy(jwtOptions, strategyHandler));
    passport.use(githubPassport);
}