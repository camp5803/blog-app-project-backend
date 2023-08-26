import { asyncWrapper } from '@/common/index';
import { StatusCodes } from 'http-status-codes';
import { userService } from '@/service/index';

export const createLocalUser = asyncWrapper(async (req, res) => {
    const user = await userService.createUser(req.body);
    if (user.error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: "error",
            message: user.message
        });
    }
    return res.status(StatusCodes.CREATED).end();
})