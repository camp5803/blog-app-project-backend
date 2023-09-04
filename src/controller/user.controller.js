import { asyncWrapper } from '@/common';
import { StatusCodes } from 'http-status-codes';
import { userService } from '@/service';
import {profileRepository} from "@/repository";

export const getProfileById = asyncWrapper(async (req, res) => {
    const user = await profileRepository.findByUserId(req.params.id);
    if (user.error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: user.message
        });
    }
    return res.status(StatusCodes.OK).json({
        nickname: user.dataValues.nickname,
        image_url: user.dataValues.image_url,
    });
});

export const validateEmail = asyncWrapper(async (req, res) => {
    const result = await userService.isEmailExists(req.query.email);
    if (!result.OK) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: result.message
        });
    }
    return res.status(StatusCodes.OK).end();
})

export const createLocalUser = asyncWrapper(async (req, res) => {
    const user = await userService.createUser(req.body);
    if (user.error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: user.message
        });
    }
    return res.status(StatusCodes.CREATED).end();
});

export const updateUser = asyncWrapper(async (req, res) => {
    const result = await userService.updateUser(req.params.id, req.body);
    if (result.message) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: result.message
        });
    }
    return res.status(StatusCodes.OK).end();
});

export const updateProfileImage = asyncWrapper(async (req, res) => {
    if (req.file) {
        const result = await userService.updateUser(req.params.id, { image_url: req.file.location });
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

export const deleteUser = asyncWrapper(async (req, res) => {
    if (req.user.user_id !== req.body.user_id) { 
        return res.status(StatusCodes.FORBIDDEN).json({
            message: "[Withdrawal Error#3] Permission denied."
        });
    }
    const error = await userService.deleteUser(req.cookies["access_token"]);
    if (error) {
        if (error.error === 404) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: error.message
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
    return res.status(StatusCodes.OK).end();
});