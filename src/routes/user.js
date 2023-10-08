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

router.route('/users/block/:block_id')
    .post(isAuthorized, userController.blockUser);

router.patch('/users/image', isAuthenticated,
    upload.single('image'), userController.updateProfileImage);

router.route('/users/neighbors/:id')
    .post(isAuthorized, userController.followNeighbor)
    .delete(isAuthorized, userController.unfollowNeighbor);

router.get('/users/me', isAuthenticated, userController.getMyProfile);
router.get('/users/block', isAuthorized, userController.getBlockUser);
router.get('/users/email', userController.validateEmail);
router.get('/users/neighbors/follower/:id', userController.getFollowers);
router.get('/users/neighbors/following/:id', userController.getFollowings);
router.get('/users/neighbors/:id/count', userController.getNeighborsCount);

router.patch('/users/password-reset', userController.resetPassword);
router.post('/users/password-reset/request', userController.sendMail);
router.post('/users/password-reset/confirm', userController.checkVerification);

router.get('/users/:id', userController.getProfileById);

export default router;