import express from 'express';
import { userController } from '@/controller';
import { isAuthenticated, isAuthorized } from "@/middleware";
import { upload } from '@/utils';

const router = express.Router();

router.route('/users')
    .post(userController.createLocalUser)
    .delete(isAuthorized, userController.deleteUser);

router.route('/users/name')
    .get(userController.validateNickname)
    .patch(isAuthorized, userController.updateNickname);

router.route('/users/preferences')
    .get(isAuthorized, userController.getUserPreferences)
    .patch(isAuthorized, userController.updateUserPreferences);

router.route('/users/keywords')
    .get(isAuthenticated, userController.getKeywords)
    .post(isAuthorized, userController.createMyKeyword)
    .delete(isAuthorized, userController.dissociateMyKeyword);

router.route('/users/block/:block_id')
    .post(isAuthorized, userController.blockUser);

router.patch('/users/image', isAuthenticated,
    upload.single('image'), userController.updateProfileImage);

router.get('/users/me', isAuthenticated, userController.getMyProfile);
router.get('/users/email', userController.validateEmail);
router.patch('users/password', isAuthorized, userController.changePassword);
router.patch('/users/password-reset', userController.resetPassword);
router.post('/users/password-reset/request', userController.sendMail);
router.post('/users/password-reset/confirm', userController.checkVerification);

router.get('/users/:id', userController.getProfileById);

export default router;