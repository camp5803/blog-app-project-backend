import express from 'express';
import { createLocalUser, deleteUser, getProfileById, updateUser, updateProfileImage, validateEmail } from '@/controller';
import { upload } from '@/utils';

const router = express.Router();

router.route('/users')
    .post(createLocalUser)
    .delete(deleteUser);


router.patch('/users/name', updateUser);
router.patch('/users/image', upload.single('image'), updateProfileImage);
router.get('/users/email', validateEmail)
router.get('/users', getProfileById)

export default router;
