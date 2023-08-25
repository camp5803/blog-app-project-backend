// import { User } from '@/database/models/db' 모델 쪽은 임의로 적어놨습니다.
export const userRepository = {

    createUser: async (userData) => {
        try {
            const user = await User.create(userData);
            return user;
        } catch (error) {
            throw new Error('Error creating user in repository');
        }
    }
}