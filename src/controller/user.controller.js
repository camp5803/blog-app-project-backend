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
});

export const deleteUser = asyncWrapper(async (req, res) => { // 만약에 조회했는데 없는 경우 200 말고 다른거 줘야함
    const error = await userService.deleteUser(req.body); // 그리고 사용자 인증정보 받아서 자기랑 다르면 403이나 401 줘야함
    if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: "error",
            message: error.message
        });
    }
    return res.status(StatusCodes.OK).end();
});