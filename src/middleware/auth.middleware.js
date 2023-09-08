import { StatusCodes } from "http-status-codes";
import { verifyToken } from '@/utils';

export const isAuthenticated = (req, res, next) => {
    const token = req.cookies["access_token"];
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
        return next();
    }
    req.user = verifyResult;
    return next();
}

export const isAuthorized = (req, res, next) => { // 유저 인증이 필요한 경우에 사용할 미들웨어
    const token = req.cookies["access_token"];
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