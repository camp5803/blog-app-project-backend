import { userRepository } from '@/repository/index';

export const userService = {
    createUser: async (data) => { // data의 key는 email, login_type, nickname, password
        const user = await userRepository.findByEmail(data.email);
        if (user) {
            return {
                error: true,
                message: "[Signup Error#1] Email Already exists."
            }
        }

        return await userRepository.createUser(data);
    },
    deleteUser: async (data) => {
        try {
            const count = await userRepository.deleteUser(data.user_id);
            if (count != 0) {
                return {
                    error: 404,
                    message: "[Withdrawal Error#1] User not found"
                }
            }
        } catch (error) {
            return {
                error: 500,
                message: "[Withdrawal Error#2] Delete query failed."
            }
        }
    }
}