import { asyncWrapper, customResponse } from '@/common/index';
import { StatusCodes } from 'http-status-codes';

export const createAuth = asyncWrapper(async (req, res) => {
    const response = customResponse(res);
    try {
        response.success({ code: StatusCodes.OK });
    } catch (err) {
        response.error(err);
    }
});

export const updateAuth = asyncWrapper(async (req, res) => {
    const response = customResponse(res);
    try {
        response.success({ code: StatusCodes.OK });
    } catch (err) {
        response.error(err);
    }
});
