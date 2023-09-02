import { asyncWrapper } from '@/common/index';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { authService, socialLoginService } from '@/service';

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
            return res.status(StatusCodes.OK).json(token);
        });
    })(req, res);
});

export const createSocialAuth = asyncWrapper(async (req, res) => {
    const type = req.params.type;
    if (['github', 'kakao', 'google'].includes(type)) {
        passport.authenticate(type)(req, res);
        return;
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
        message: "[Login Error#7] Bad request."
    });
});

export const socialCallbackHandler = asyncWrapper(async (req, res) => {
    const type = req.params.type;

    if (type === "kakao") {
        const kakaoUser = await socialLoginService.kakaoLoginService(req.body.code);
        if (kakaoUser.hasOwnProperty("error")) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: kakaoUser.error
            });
        }
        if (kakaoUser.email == null) {
            return res.status(StatusCodes.CREATED).json({
                accessToken: kakaoUser.accessToken,
                refreshToken: kakaoUser.refreshToken,
                message: "[Alert] Email information needs to be updated"
            });
        }
        return res.status(StatusCodes.OK).json(kakaoUser);
    } else if (type === "github") {
        const githubUser = await socialLoginService.githubLoginService(req.body.code);
        if (githubUser.hasOwnProperty("error")) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: githubUser.error
            });
        }
        if (githubUser.email == null) {
            return res.status(StatusCodes.CREATED).json({
                accessToken: githubUser.accessToken,
                refreshToken: githubUser.refreshToken,
                message: "[Alert] Email information needs to be updated"
            });
        }
        return res.status(StatusCodes.OK).json({
            accessToken: githubUser.accessToken,
            refreshToken: githubUser.refreshToken,
        });
    } else if (type === "google"){
        const googleUser = await socialLoginService.googleLoginService(req.body.code);
        if (googleUser.hasOwnProperty("error")) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: googleUser.error
            });
        }
        if (googleUser.email == null) {
            return res.status(StatusCodes.CREATED).json({
                accessToken: googleUser.accessToken,
                refreshToken: googleUser.refreshToken,
                message: "[Alert] Email information needs to be updated"
            });
        }
        return res.status(StatusCodes.CREATED).json({
            accessToken: googleUser.accessToken,
            refreshToken: googleUser.refreshToken
        });
    }

    return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Bad request."
    });
});

// export const redirectOAuth = asyncWrapper(async (req, res) => { // /api/auth/type
//     const redirectURL = `http://${process.env.SERVER_URL}:${process.env.PORT || 8280}/api/auth/callback/${req.params.type}`;
//     const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_ID}&redirect_uri=${redirectURL}&response_type=code&scope=profile_nickname,account_email`;
//     const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_ID}&redirect_uri=${redirectURL}`;
//     const googleAuthURL = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_ID}&redirect_uri=${redirectURL}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email`;
//
//     const authorizeURL = req.params.type === "kakao" ? kakaoAuthURL : (req.params.type === "github" ? githubAuthURL : googleAuthURL);
//     res.redirect(authorizeURL);
// });

export const reissueAccessToken = asyncWrapper(async (req, res) => { // body: accessToken
    const accessToken = await authService.reissueToken(req.body.token);
    if (accessToken.error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: accessToken.error
        });
    }
    return res.status(200).json({ accessToken });
});