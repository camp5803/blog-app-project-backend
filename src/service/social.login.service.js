import { socialLoginRepository, userRepository } from '@/repository/index';
import { createToken } from '@/utils/index'

export const socialLoginService = {
    createTokenForSocialUser: async (social_id) => {
        const socialUser = await socialLoginRepository.findBySocialId(social_id);
        const user = await userRepository.findById(socialUser.user_id);
        if (!socialUser || !user) {
            return {
                error: 404,
                message: "[Login Error#8] Social-User not found."
            }
        }
        const token = await createToken(user.user_id);
        if (token.error) {
            return {
                error: true,
                message: token.message,
            }
        }
        return token;
    }
}