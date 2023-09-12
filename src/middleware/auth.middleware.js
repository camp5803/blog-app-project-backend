import { StatusCodes } from "http-status-codes";
import { verifyToken } from '@/utils';

/** 
 * isAuthencitated
 * 
 * cookie로 AccessToken을 검증한 후 req.user에 담아 컨트롤러로 전달
 * 뒤에 req.user가 사용될 수 있지만, 없어도 상관 없는 경우 사용
 * 미들웨어 공통으로 토큰이 정상적이지 않는 경우에는 에러 메시지 전달
*/
export const isAuthenticated = (req, res, next) => {
    const token = req.cookies["accessToken"];
    if (!token) {
        return next();
    }
    const verifyResult = verifyToken(token);
    if (verifyResult.error) {
        if (verifyResult.error === "TokenExpiredError") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "[Token Error#3] Access token has expired."
            });
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "[Token Error#2] Invalid access token."
        });
    }
    req.user = verifyResult;
    return next();
}

/** 
 * isAuthencitated
 * 
 * cookie로 AccessToken을 검증한 후 req.user에 담아 컨트롤러로 전달
 * 뒤에 실행될 컨트롤러가 인증 정보가 필요한 경우 사용
*/
export const isAuthorized = (req, res, next) => {
    const token = req.cookies["accessToken"];
    if (!token) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "[Token Error#1] No access token found."
        });
    }
    const verifyResult = verifyToken(token);
    if (verifyResult.error) {
        if (verifyResult.error.message === "TokenExpiredError") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "[Token Error#3] Access token has expired."
            });
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "[Token Error#2] Invalid access token."
        });
    }
    req.user = verifyResult;
    return next();
}