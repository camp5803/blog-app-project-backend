import { userRepository } from '@/repository/index';

export const userService = {

    createUser: async (userData) => {
        try {
            const user = await userRepository.createUser(userData);
            return user;
        } catch (error) {
            throw new Error('Error creating user');
        }
    }
}


