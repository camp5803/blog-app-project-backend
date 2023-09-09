import { asyncWrapper } from '@/common';
import { StatusCodes } from 'http-status-codes';
import { preferenceService, userService, keywordService } from '@/service';
import { profileRepository } from "@/repository";

const getProfileById = asyncWrapper(async (req, res) => {
    try {
        const userId = profileRepository.findUserIdByToken(req.cookies["access_token"]);
        const userData = await profileRepository.findUserInformationById(userId);
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
    const userData = await profileRepository.findUserInformationById(user.dataValues.user_id);
    return res.status(StatusCodes.CREATED).json(userData);
});

const updateUser = asyncWrapper(async (req, res) => {
    const userId = profileRepository.findUserIdByToken(req.cookies["access_token"]);
    const result = await userService.updateUser(userId, req.body);
    if (result.message) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: result.message
        });
    }
    return res.status(StatusCodes.OK).end();
});

const updateProfileImage = asyncWrapper(async (req, res) => {
    const userId = profileRepository.findUserIdByToken(req.cookies["access_token"]);
    if (req.file) {
        const result = await userService.updateUser(userId, { image_url: req.file.location });
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
    const userId = profileRepository.findUserIdByToken(req.cookies["access_token"]);
    const result = await userService.deleteUser(userId);
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
    const userId = profileRepository.findUserIdByToken(req.cookies["access_token"]);
    const preferences = await preferenceService.getPreferences(userId);
    if (preferences.message) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: preferences.message
        });
    }
    return res.status(StatusCodes.OK).json(preferences.dataValues);
});

const updateUserPreferences = asyncWrapper(async (req, res) => {
    const userId = profileRepository.findUserIdByToken(req.cookies["access_token"]);
    const result = await preferenceService.updatePreferences(userId, req.body);
    if (result.message) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: result.message
        });
    }
    return res.status(StatusCodes.OK).end();
});

const getMyKeywords = asyncWrapper(async (req, res) => {
    const userId = profileRepository.findUserIdByToken(req.cookies["access_token"]);
    const keywords = await keywordService.getUserKeywords(userId);
    if (keywords.message) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: keywords.message
        });
    }
    return res.status(StatusCodes.OK).json(keywords);
});

const createMyKeyword = asyncWrapper(async (req, res) => {
    const userId = profileRepository.findUserIdByToken(req.cookies["access_token"]);
    const result = await keywordService.createUserKeyword(userId, req.body.keyword);
    if (result.message) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: result.message
        });
    }
    return res.status(StatusCodes.CREATED).end();
});

const dissociateMyKeyword = asyncWrapper(async (req, res) => {
    const userId = profileRepository.findUserIdByToken(req.cookies["access_token"]);
    const result = keywordService.dissociateKeywordFromUser(userId, req.body.keyword);
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