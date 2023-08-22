import { asyncWrapper, customResponse } from '@/common/index';
import { StatusCodes } from 'http-status-codes';

export const createUser = asyncWrapper(async (req, res) => {
    const response = customResponse(res);
    try {
        response.success({ code: StatusCodes.OK });
    } catch (err) {
        response.error(err);
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