import { asyncWrapper, customResponse } from '@/common/index';
import { StatusCodes } from 'http-status-codes';
import { userService } from '@/service/index';

export const createUser = asyncWrapper(async (req, res) => {
    try {
        const { userId, email, nickname, password, profileImg } = req.body;
        const user = await userService.createUser({ userId, email, nickname, password, profileImg });
        res.status(201).json({ user });
    } catch (err) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

export const getAllUsers = asyncWrapper(async (req, res) => {
    const response = customResponse(res);
    try {
        response.success({ code : StatusCodes.OK });
    } catch (err) {
        response.error(err);
    }
});

export const getUser = asyncWrapper(async (req, res) => {
    const response = customResponse(res);
    try {
        response.success({ code : StatusCodes.OK });
    } catch (err) {
        response.error(err);
    }
})

export const updateUser = asyncWrapper(async (req, res) => {
    const response = customResponse(res);
    try {
        response.success({ code: StatusCodes.OK });
    } catch (err) {
        response.error(err);
    }
});

export const deleteUser = asyncWrapper(async (req, res) => {
    const response = customResponse(res);
    try {
        response.success({ code: StatusCodes.OK });
    } catch (err) {
        response.error(err);
    }
});