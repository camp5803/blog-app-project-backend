import { asyncWrapper } from '@/common';
import { StatusCodes } from 'http-status-codes';
import { authService, socialLoginService, userService } from '@/service';

const cookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'None',
    maxAge: 1000 * 60 * 60 * 24 * 14 // 14d
}

if (process.env.SECURE_ENABLED) {
    cookieOptions.secure = true;
}

export const authController = {
    createAuth: asyncWrapper(async (req, res) => {
        if (!req.body.email || !req.body.password) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
        }
        const token = await authService.login(req.body.email, req.body.password);
        const userData = await userService.getUserInformation(token.accessToken);
        res.cookie('accessToken', token.accessToken, cookieOptions);
        res.cookie('refreshToken', token.refreshToken, cookieOptions);
    
        return res.status(StatusCodes.OK).json(userData);
    }),
    reissueAccessToken: asyncWrapper(async (req, res) => {
        const tokens = await authService.reissueToken(
            req.cookies['accessToken'], req.cookies['refreshToken']);
        res.cookie('accessToken', tokens.accessToken, cookieOptions);
        res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
        return res.status(StatusCodes.OK).end();
    }),
    socialCallbackHandler: asyncWrapper(async (req, res) => {
        const type = req.params.type;
        const result = await socialLoginService.login(type.toUpperCase(), req.body.code, req.body.uri);
        res.cookie('accessToken', result.token.accessToken, cookieOptions);
        res.cookie('refreshToken', result.token.refreshToken, cookieOptions);
        if (result.profile.email === null) {
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
    }),
    logout: asyncWrapper(async (req, res) => {
        await authService.logout(req.user.userId);
        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);
        return res.status(StatusCodes.OK).end();
    })
}