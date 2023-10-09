import { StatusCodes } from "http-status-codes";
import { verifyToken } from '@/utils';
import { authService } from '@/service';

const cookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'None',
    maxAge: 1000 * 60 * 60 * 24 * 14 // 14d
}

if (process.env.SECURE_ENABLED) {
    cookieOptions.secure = true;
}

/** 
 * isAuthencitated
 * 
 * cookie로 AccessToken을 검증한 후 req.user에 담아 컨트롤러로 전달
 * 뒤에 req.user가 사용될 수 있지만, 없어도 상관 없는 경우 사용
 * 미들웨어 공통으로 토큰이 정상적이지 않는 경우에는 에러 메시지 전달
*/
export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies["accessToken"];
    if (!token) {
        return next();
    }
    const verifyResult = verifyToken(token);
    if (verifyResult.error) {
        if (verifyResult.error === "TokenExpiredError") {
            const newToken = await authService.reissueToken(
                req.cookies["accessToken"], req.cookies["refreshToken"]
            );
            res.cookie('accessToken', newToken.accessToken, cookieOptions);
            res.cookie('refreshToken', newToken.refreshToken, cookieOptions);
            req.user = verifyToken(newToken.accessToken);
            return next();
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "[Token Error#2] Invalid access token."
        });
    }
    req.user = verifyResult;
    return next();
}

/** 
 * isAuthorized
 * 
 * cookie로 AccessToken을 검증한 후 req.user에 담아 컨트롤러로 전달
 * 뒤에 실행될 컨트롤러가 인증 정보가 필요한 경우 사용
*/
export const isAuthorized = async (req, res, next) => {
    const token = req.cookies["accessToken"];
    if (!token) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "[Token Error#1] No access token found."
        });
    }
    const verifyResult = verifyToken(token);
    if (verifyResult.error) {
        if (verifyResult.error === "TokenExpiredError") {
            const newToken = await authService.reissueToken(
                req.cookies["accessToken"], req.cookies["refreshToken"]
            );
            res.cookie('accessToken', newToken.accessToken, cookieOptions);
            res.cookie('refreshToken', newToken.refreshToken, cookieOptions);
            req.user = verifyToken(newToken.accessToken);
            return next();
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "[Token Error#2] Invalid access token."
        });
    }
    req.user = verifyResult;
    return next();
}