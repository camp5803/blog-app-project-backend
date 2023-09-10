import express from 'express';
import { userController } from '@/controller';
import { isAuthenticated, isAuthorized } from "@/middleware";
import { upload } from '@/utils';

const router = express.Router();

router.route('/users')
    .get(isAuthenticated, userController.getProfileById)
    .post(userController.createLocalUser)
    .delete(isAuthorized, userController.deleteUser);

router.route('/users/name')
    .get(userController.validateNickname)
    .patch(isAuthorized, userController.updateNickname);

router.route('/users/preferences')
    .get(isAuthorized, userController.getUserPreferences)
    .patch(isAuthorized, userController.updateUserPreferences);

router.patch('/users/image', isAuthenticated,
    upload.single('image'), userController.updateProfileImage);

router.route('/users/keyword')
    .get(userController.getMyKeywords)
    .post(isAuthorized, userController.createMyKeyword)
    .delete(isAuthorized, userController.dissociateMyKeyword);

router.get('/users/email', userController.validateEmail);

export default router;