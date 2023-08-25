import { User } from '@/database/index'
import { asyncWrapper } from '@/common/index';

export const userRepository = {
    findByPassword: asyncWrapper(async (data) => {
        const user = await User.findOne({ where: { email: data.email, password: data.password }});
        return user;
    }),
    findByUserId: asyncWrapper(async (data) => {
        const user = await User.findOne({ where: { user_id: data.userId }});
    })
}