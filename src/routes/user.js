import express from 'express';
import { createLocalUser, deleteUser, getProfileById, updateUser, updateProfileImage, validateEmail } from '@/controller';
import { isAuthenticated, isAuthorized } from "@/middleware";
import { upload } from '@/utils';

const router = express.Router();

router.route('/users')
    .post(createLocalUser)
    .delete(isAuthorized, deleteUser);


router.patch('/users/name', isAuthenticated, updateUser);
router.patch('/users/image', isAuthenticated, upload.single('image'), updateProfileImage);
router.get('/users/email', validateEmail);
router.get('/users', isAuthenticated, getProfileById);

export default router;
