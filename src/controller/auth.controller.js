import { asyncWrapper } from '@/common/index';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { authService } from '@/service/index';

export const createAuth = asyncWrapper(async (req, res) => {
    passport.authenticate('local', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "[Login Failed #1] Please check your email and password"
            })
        }

        req.login(user, { session: false }, async (err) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "[Login Failed #2] Bad request"
                });
            }
            const token = await authService.createToken(user);
            if (token.error) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: token.error
                });
            }
            return res.status(StatusCodes.OK).json(token);
        });
    })(req, res);
});

export const isAuthenticated = (req, res) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (user) {
            return res.status(StatusCodes.OK).json({ status: "success" });
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "[Unauthorized Error] Please log in again"
        });
    })(req, res);
} // 여기서 리프레시해서 발급할지, 프론트에서 요청할지 의논하기

export const createSocialAuth = asyncWrapper(async (req, res) => {

})

export const reissueAccessToken = asyncWrapper(async (req, res) => { // body: accessToken
    const accessToken = await authService.reissueToken(req.body.token);
    if (accessToken.error) {
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(200).json({ accessToken });
});