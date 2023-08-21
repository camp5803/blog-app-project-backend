import express from 'express';
import { createUser, updateUser } from '@/controller/index';

const router = express.Router();

router.route('/user/create').post(createUser);
router.route('/user/update').post(updateUser);

export default router;
