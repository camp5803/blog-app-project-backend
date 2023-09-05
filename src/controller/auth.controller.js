import { asyncWrapper } from '@/common';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { authService, socialLoginService } from '@/service';

const cookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'None',
}

if (process.env.SECURE_ENABLED) {
    cookieOptions.secure = true;
}

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
            const token = await authService.createToken(user.user_id);
            if (token.error) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: token.error
                });
            }
            res.cookie('access_token', token.accessToken, cookieOptions);
            res.cookie('refresh_token', token.refreshToken, cookieOptions);

            return res.status(StatusCodes.OK).end();
        });
    })(req, res);
});

export const socialCallbackHandler = asyncWrapper(async (req, res) => {
    const type = req.params.type;

    if (type === "kakao") {
        const kakaoUser = await socialLoginService.kakaoLoginService(req.body.code, req.body.uri);
        if (kakaoUser.hasOwnProperty("error")) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: kakaoUser.error
            });
        }
        res.cookie('access_token', kakaoUser.accessToken, cookieOptions);
        res.cookie('refresh_token', kakaoUser.refreshToken, cookieOptions);
        if (kakaoUser.email == null) {
            return res.status(StatusCodes.CREATED).json({
                message: "[Alert] Email information needs to be updated"
            });
        }
        return res.status(StatusCodes.CREATED).end();
    } else if (type === "github") {
        const githubUser = await socialLoginService.githubLoginService(req.body.code, req.body.uri);
        if (githubUser.hasOwnProperty("error")) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: githubUser.error
            });
        }
        res.cookie('access_token', githubUser.accessToken, cookieOptions);
        res.cookie('refresh_token', githubUser.refreshToken, cookieOptions);
        if (githubUser.email == null) {
            return res.status(StatusCodes.CREATED).json({
                message: "[Alert] Email information needs to be updated"
            });
        }
        return res.status(StatusCodes.CREATED).end();
    } else if (type === "google"){
        const googleUser = await socialLoginService.googleLoginService(req.body.code, req.body.uri);
        if (googleUser.hasOwnProperty("error")) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: googleUser.error
            });
        }
        res.cookie('access_token', googleUser.accessToken, cookieOptions);
        res.cookie('refresh_token', googleUser.refreshToken, cookieOptions);
        if (googleUser.email == null) {
            return res.status(StatusCodes.CREATED).json({
                message: "[Alert] Email information needs to be updated"
            });
        }
        return res.status(StatusCodes.CREATED).end();
    }

    return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Bad request."
    });
});

export const reissueAccessToken = asyncWrapper(async (req, res) => { // body: accessToken
    const accessToken = await authService.reissueToken(req.body.token);
    if (accessToken.error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: accessToken.error
        });
    }
    return res.status(200).json({ accessToken });
});