import { userRepository, profileRepository } from '@/repository';
import { verifyToken } from '@/utils';

export const userService = {
    isEmailExists: async (email) => {
        try {
            const user = await userRepository.findByEmail(email);
            if (user) {
                return {
                    error: "Email Already exists."
                }
            }
            return true;
        } catch (error) {
            return { error }
        }
    },
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
    updateUser: async (user_id, data) => {
        try {
            const user = await profileRepository.findByUserId(user_id);
            const userData = user.dataValues;

            Object.keys(userData).forEach(key => {
                if (data[key]) {
                    userData[key] = data[key];
                }
            });

            return await profileRepository.updateProfile(userData);
        } catch (error) {
            return { message: error }
        }
    },
    deleteUser: async (token) => {
        const payload = verifyToken(token);
        try {
            const count = await userRepository.deleteUser(payload.user_id);
            if (count === 0) {
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