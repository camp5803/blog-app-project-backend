import { asyncWrapper } from '@/common/index';
import { StatusCodes } from 'http-status-codes';
import { userService } from '@/service/index';

export const createLocalUser = asyncWrapper(async (req, res) => {
    const user = await userService.createUser(req.body);
    if (user.error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: user.message
        });
    }
    return res.status(StatusCodes.CREATED).end();
});

export const deleteUser = asyncWrapper(async (req, res) => {
    if (req.user.user_id !== req.body.user_id) { 
        return res.status(StatusCodes.FORBIDDEN).end();
    }
    const error = await userService.deleteUser(req.body);
    if (error) {
        if (error = 404) {
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