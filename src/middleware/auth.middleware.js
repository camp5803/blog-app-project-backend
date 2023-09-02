import passport from "passport";
import { StatusCodes } from "http-status-codes";

export const isAuthenticated = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "[Authenticate Error] Please log in again"
            });
        }
        req.user = user;
        next();
    })(req, res, next);
}

export const isAuthorized = (req, res, next) => { // 유저 인증이 필요한 경우에 사용할 미들웨어
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "[Unauthorized Error] Please log in again"
            });
        }
        if (user) {
            req.user = user;
        }
        next();
    })(req, res, next);
}