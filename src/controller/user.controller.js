import { asyncWrapper } from '@/common';
import { StatusCodes } from 'http-status-codes';
import { preferenceService, userService, keywordService } from '@/service';
import { profileRepository } from "@/repository";

const getProfileById = asyncWrapper(async (req, res) => {
    try {
        const userData = await profileRepository.findUserInformationById(req.user.userId);
        return res.status(StatusCodes.OK).json(userData);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message
        });
    }
});

const validateEmail = asyncWrapper(async (req, res) => {
    const result = await userService.isEmailExists(req.query.value);
    if (!result.OK) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: result.message
        });
    }
    return res.status(StatusCodes.OK).end();
});

const validateNickname = asyncWrapper(async (req, res) => {
    const result = await userService.isNicknameExists(req.query.value);
    if (!result.OK) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: result.message
        });
    }
    return res.status(StatusCodes.OK).end();
});

const createLocalUser = asyncWrapper(async (req, res) => {
    const user = await userService.createUser(req.body);
    if (user.message) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: user.message
        });
    }
    const userData = await profileRepository.findUserInformationById(user.data.userId);

    res.cookie('accessToken', user.token.accessToken, cookieOptions);
    res.cookie('refreshToken', user.token.refreshToken, cookieOptions);
    return res.status(StatusCodes.CREATED).json(userData);
});

const updateUser = asyncWrapper(async (req, res) => {
    const result = await userService.updateUser(req.user.userId, req.body.nickname);
    if (result.message) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: result.message
        });
    }
    return res.status(StatusCodes.OK).end();
});

const updateProfileImage = asyncWrapper(async (req, res) => {
    if (req.file) {
        const result = await userService.updateUser(req.user.userId, { imageUrl: req.file.location });
        if (result.error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: result.message
            });
        }
        return res.status(StatusCodes.OK).end();
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
        message: "[UploadError#1] Invalid mimetype or file upload error."
    });
})

const deleteUser = asyncWrapper(async (req, res) => {
    const result = await userService.deleteUser(req.user.userId);
    if (result) {
        if (result.error === 404) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: result.message
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: result.message
        });
    }
    return res.status(StatusCodes.OK).end();
});

const getUserPreferences = asyncWrapper(async (req, res) => {
    const preferences = await preferenceService.getPreferences(req.user.userId);
    if (preferences.message) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: preferences.message
        });
    }
    return res.status(StatusCodes.OK).json(preferences.dataValues);
});

const updateUserPreferences = asyncWrapper(async (req, res) => {
    const result = await preferenceService.updatePreferences(req.user.userId, req.body);
    if (result.message) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: result.message
        });
    }
    return res.status(StatusCodes.OK).end();
});

const getMyKeywords = asyncWrapper(async (req, res) => {
    const keywords = await keywordService.getUserKeywords(req.user.userId);
    if (keywords.message) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: keywords.message
        });
    }
    return res.status(StatusCodes.OK).json(keywords);
});

const createMyKeyword = asyncWrapper(async (req, res) => {
    const result = await keywordService.createUserKeyword(req.user.userId, req.body.keyword);
    if (result.message) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: result.message
        });
    }
    return res.status(StatusCodes.CREATED).end();
});

const dissociateMyKeyword = asyncWrapper(async (req, res) => {
    const result = keywordService.dissociateKeywordFromUser(req.user.userId, req.body.keyword);
    if (result.message || result === 0) {
        return res.status(result === 0 ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: result === 0 ? "Keyword not associated." : result.message
        });
    }
    return res.status(StatusCodes.OK).end();
})

export const userController = {
    getProfileById,
    validateEmail,
    validateNickname,
    createLocalUser,
    updateUser,
    updateProfileImage,
    deleteUser,
    getUserPreferences,
    updateUserPreferences,
    getMyKeywords,
    createMyKeyword,
    dissociateMyKeyword
}