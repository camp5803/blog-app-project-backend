import { asyncWrapper } from '@/common';
import { userRepository } from '@/repository/index';

export const userService = {
    createUser: async (data) => { // data의 key는 email, login_type, nickname
        const user = await userRepository.findByEmail({ email: data.email });
        if (!user) {
            return {
                error: true,
                message: "[Signup Error#1] Email Already exists."
            }
        }

        return await userRepository.createUser(data);
    }
}


