import { StatusCodes } from 'http-status-codes';

export const customResponse = (res) => {
    return {
        success({ code = StatusCodes.OK, data, message }) {
            return res.status(code).json({ result: true, code, data, message });
        },
        error({ code, message, error, data }) {
            return res
                .status(code)
                .json({ result: false, code, message, error, data });
        },
    };
};
