import { asyncWrapper } from '@/common';
import { StatusCodes } from 'http-status-codes';
import { authService, preferenceService, userService, neighborService } from '@/service';
import { profileRepository } from "@/repository";
import { customError } from '@/common/error';

const cookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'None',
    maxAge: 1000 * 60 * 60 * 24 * 14 // 14d
}

if (process.env.SECURE_ENABLED) {
    cookieOptions.secure = true;
}

export const userController = {
    getMyProfile: asyncWrapper(async (req, res) => {
        try {
            const profile = await profileRepository.findUserInformationById(req.user.userId);
            return res.status(StatusCodes.OK).json(profile);
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    }),
    getProfileById: asyncWrapper(async (req, res) => {
        try {
            if (!req.params.id) {
                throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
            }
            const profile = await profileRepository.findByUserId(req.params.id);
            return res.status(StatusCodes.OK).json({
                userId: profile.userId, 
                nickname: profile.nickname, 
                imageUrl: profile.imageUrl
            });
        } catch (error) {
            return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).end();
        }
    }),
    validateEmail: asyncWrapper(async (req, res) => {
        if (!req.query.value) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request query not present.`);
        }
        await userService.isEmailExists(req.query.value);
        return res.status(StatusCodes.OK).end();
    }),
    validateNickname: asyncWrapper(async (req, res) => {
        if (!req.query.value) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request query not present.`);
        }
        await userService.isNicknameExists(req.query.value);
        return res.status(StatusCodes.OK).end();
    }),
    createLocalUser: asyncWrapper(async (req, res) => {
        if (!req.body.email || !req.body.password || !req.body.nickname) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
        }
        const user = await userService.createUser(req.body);
        const userData = await profileRepository.findUserInformationById(user.data.userId);
    
        res.cookie('accessToken', user.token.accessToken, cookieOptions);
        res.cookie('refreshToken', user.token.refreshToken, cookieOptions);
        return res.status(StatusCodes.CREATED).json(userData);
    }),
    updateNickname: asyncWrapper(async (req, res) => {
        if (!req.body.nickname) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
        }
        await userService.updateUser(req.user.userId, { nickname: req.body.nickname });
        return res.status(StatusCodes.OK).end();
    }),
    updateProfileImage: asyncWrapper(async (req, res) => {
        if (req.file) {
            await userService.updateUser(req.user.userId, { imageUrl: req.file.location });
            return res.status(StatusCodes.OK).end();
        }
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(`Request body not present.`);
    }),
    deleteUser: asyncWrapper(async (req, res) => {
        await userService.deleteUser(req.user.userId);
        await authService.logout(req.user.userId);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.status(StatusCodes.OK).end();
    }),
    getUserPreferences: asyncWrapper(async (req, res) => {
        const preferences = await preferenceService.getPreferences(req.user.userId);
        return res.status(StatusCodes.OK).json(preferences);
    }),
    updateUserPreferences: asyncWrapper(async (req, res) => {
        if (!req.body || !Object.keys(req.body).length) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
        }
        await preferenceService.updatePreferences(req.user.userId, req.body);
        return res.status(StatusCodes.OK).end();
    }),
    updateUserDarkmode: asyncWrapper(async (req, res) => {
        if (!req.body.value) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
        }
        await preferenceService.updateDarkmode(req.user.userId, req.body.value);
        return res.status(StatusCodes.OK).end();
    }),
    sendMail: asyncWrapper(async (req, res) => {
        if (!req.body.email) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
        }
        await userService.sendPasswordResetMail(req.body.email);
        return res.status(StatusCodes.OK).json({
            message: "Authentication code has been sent."
        });
    }),
    checkVerification: asyncWrapper(async (req, res) => {
        if (!req.body.email || !req.body.code) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
        }
        const result = await userService.checkVerification(req.body.email, req.body.code);
        if (result) {
            return res.status(StatusCodes.OK).json();
        }
        return res.status(StatusCodes.CONFLICT).json({
            message: "Authentication code does not match."
        });
    }),
    resetPassword: asyncWrapper(async (req, res) => {
        if (!req.body.email || !req.body.code || !req.body.password) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
        }
        await userService.verificationMailHandler(req.body.email, req.body.code, req.body.password);
        return res.status(StatusCodes.OK).json();
    }),
    blockUser: asyncWrapper(async (req, res) => {
        if (!req.params.block_id) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
        }
        const blockUserId = await neighborService.blockUser(req.user.userId, req.params.block_id);
        return res.status(StatusCodes.OK).json({ blockId: blockUserId });
    }),
    unBlockUser: asyncWrapper(async (req, res) => {
        if (!req.params.block_id) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
        }
        const blockUserId = await neighborService.unBlockUser(req.user.userId, req.params.block_id);
        return res.status(StatusCodes.OK).json({ blockId: blockUserId });
    }),
    getBlockUser: asyncWrapper(async (req, res) => {
        const blockerdUsers = await neighborService.getBlockUsers(req.user.userId);
        return res.status(StatusCodes.OK).json(blockerdUsers);
    }),
    getFollowers: asyncWrapper(async (req, res) => {
        const followers = await neighborService.getFollowers(req.params.id);
        return res.status(StatusCodes.OK).json(followers);
    }),
    getFollowings: asyncWrapper(async (req, res) => {
        const followings = await neighborService.getFollowings(req.params.id);
        return res.status(StatusCodes.OK).json(followings);
    }),
    getNeighborsCount: asyncWrapper(async (req, res) => {
        if (!req.params.id) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
        }
        const counts = await neighborService.getNeighborsCounts(req.params.id);
        return res.status(StatusCodes.OK).json(counts);
    }),
    followNeighbor: asyncWrapper(async (req, res) => {
        if (!req.params.id) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
        }
        await neighborService.follow(req.user.userId, req.params.id);
        return res.status(StatusCodes.OK).end()
    }),
    unfollowNeighbor: asyncWrapper(async (req, res) => {
        if (!req.params.id) {
            throw customError(StatusCodes.UNPROCESSABLE_ENTITY, `Request body not present.`);
        }
        await neighborService.unfollow(req.user.userId, req.params.id);
        return res.status(StatusCodes.OK).end()
    })
}