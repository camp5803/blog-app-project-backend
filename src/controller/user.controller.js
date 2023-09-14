import { asyncWrapper } from '@/common';
import { StatusCodes } from 'http-status-codes';
import { preferenceService, userService, keywordService } from '@/service';
import { profileRepository } from "@/repository";
import { customError } from '@/common/error';

const cookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'None',
}

if (process.env.SECURE_ENABLED) {
    cookieOptions.secure = true;
}

const getMyProfile = asyncWrapper(async (req, res) => {
    try {
        const profile = await profileRepository.findUserInformationById(req.user.userId);
        return res.status(StatusCodes.OK).json(profile);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message
        });
    }
});

const getProfileById = asyncWrapper(async (req, res) => {
    try {
        if (id === null || id === undefined) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Missing parameter "id".`);
        }
        const profile = await profileRepository.findByUserId(req.params.id);
        return res.status(StatusCodes.OK).json({
            userId: profile.userId, 
            nickname: profile.nickname, 
            imageUrl: profile.imageUrl
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

const validateEmail = asyncWrapper(async (req, res) => {
    await userService.isEmailExists(req.query.value);
    return res.status(StatusCodes.OK).end();
});

const validateNickname = asyncWrapper(async (req, res) => {
    await userService.isNicknameExists(req.query.value);
    return res.status(StatusCodes.OK).end();
});

const createLocalUser = asyncWrapper(async (req, res) => {
    const user = await userService.createUser(req.body);
    const userData = await profileRepository.findUserInformationById(user.data.userId);

    res.cookie('accessToken', user.token.accessToken, cookieOptions);
    res.cookie('refreshToken', user.token.refreshToken, cookieOptions);
    return res.status(StatusCodes.CREATED).json(userData);
});

const updateNickname = asyncWrapper(async (req, res) => {
    await userService.updateUser(req.user.userId, { nickname: req.body.nickname });
    return res.status(StatusCodes.OK).end();
});

const updateProfileImage = asyncWrapper(async (req, res) => {
    if (req.file) {
        await userService.updateUser(req.user.userId, { imageUrl: req.file.location });
        return res.status(StatusCodes.OK).end();
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
        message: "[UploadError#1] Invalid mimetype or file upload error."
    });
});

const deleteUser = asyncWrapper(async (req, res) => {
    await userService.deleteUser(req.user.userId);
    return res.status(StatusCodes.OK).end();
});

const getUserPreferences = asyncWrapper(async (req, res) => {
    const preferences = await preferenceService.getPreferences(req.user.userId);
    return res.status(StatusCodes.OK).json(preferences);
});

const updateUserPreferences = asyncWrapper(async (req, res) => {
    await preferenceService.updatePreferences(req.user.userId, req.body);
    return res.status(StatusCodes.OK).end();
});

const getMyKeywords = asyncWrapper(async (req, res) => {
    const keywords = await keywordService.getUserKeywords(req.user.userId);
    return res.status(StatusCodes.OK).json(keywords);
});

const createMyKeyword = asyncWrapper(async (req, res) => {
    await keywordService.createUserKeyword(req.user.userId, req.body.keyword);
    return res.status(StatusCodes.CREATED).end();
});

const dissociateMyKeyword = asyncWrapper(async (req, res) => {
    await keywordService.dissociateKeywordFromUser(req.user.userId, req.body.keyword);
    return res.status(StatusCodes.OK).end();
});

const sendMail = asyncWrapper(async (req, res) => {
    await userService.sendPasswordResetMail(req.body.email);
    return res.status(StatusCodes.OK).json({
        message: "Authentication code has been sent."
    });
});

const resetPassword = asyncWrapper(async (req, res) => {
    const result = await userService.verificationMailHandler(req.body.email, req.body.code);
    return res.status(StatusCodes.OK).json({
        message: `The changed temporary password is ${result}`
    });
});

const changePassword = asyncWrapper(async (req, res) => {
    await userService.updatePassword(req.user.userId, req.body.password);
    return res.status(StatusCodes.OK).end();
});

export const userController = {
    getMyProfile,
    validateEmail,
    validateNickname,
    createLocalUser,
    updateNickname,
    updateProfileImage,
    deleteUser,
    getUserPreferences,
    updateUserPreferences,
    getMyKeywords,
    createMyKeyword,
    dissociateMyKeyword,
    sendMail,
    resetPassword,
    changePassword,
    getProfileById
}