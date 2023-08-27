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
            await userRepository.deleteUser(data.user_id);
            return;
        } catch (error) {
            return {
                error: true,
                message: '[Withdrawal Error#1] Delete query failed.'
            }
        }
    }
}