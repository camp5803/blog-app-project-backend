import { asyncWrapper } from '@/common';
import { StatusCodes } from 'http-status-codes';
import { authService, socialLoginService, userService } from '@/service';

const cookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'None',
}

if (process.env.SECURE_ENABLED) {
    cookieOptions.secure = true;
}

const createAuth = asyncWrapper(async (req, res) => {
    const token = await authService.login(req.body.email, req.body.password);
    if (token.message) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: token.message
        });
    }
    const userData = await userService.getUserInformation(token.accessToken);
    if (userData.message) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: userData.message
        });
    }
    res.cookie('access_token', token.accessToken, cookieOptions);
    res.cookie('refresh_token', token.refreshToken, cookieOptions);

    return res.status(StatusCodes.OK).json(userData);
});

const socialCallbackHandler = asyncWrapper(async (req, res) => {
    const type = req.params.type;
    const result = await socialLoginService.login(type.toUpperCase(), req.body.code, req.body.uri);
    if (result.message) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: result.message
        });
    }
    res.cookie('access_token', result.token.accessToken, cookieOptions);
    res.cookie('refresh_token', result.token.refreshToken, cookieOptions);
    if (result.profile.email == null) {
        return res.status(StatusCodes.CREATED).json({
            message: "[Alert] Email information needs to be updated",
            nickname: result.profile.nickname,
            imageUrl: result.profile.imageUrl,
            darkmode: result.profile.darkmode,
        });
    }
    return res.status(StatusCodes.CREATED).json({
        nickname: result.profile.nickname,
        imageUrl: result.profile.imageUrl,
        darkmode: result.profile.darkmode,
    });
});

const reissueAccessToken = asyncWrapper(async (req, res) => {
    const tokens = await authService.reissueToken(
        req.cookies['access_token'], req.cookies['refresh_token']);
    if (tokens.message) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: tokens.message
        });
    }
    res.cookie('access_token', tokens.accessToken, cookieOptions);
    res.cookie('refresh_token', tokens.refreshToken, cookieOptions);
    return res.status(StatusCodes.OK).end();
});

export const authController = {
    createAuth,
    reissueAccessToken,
    socialCallbackHandler
}