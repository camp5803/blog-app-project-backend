import express from 'express';
import { createLocalUser, deleteUser } from '@/controller/index';

const router = express.Router();

router.route('/user')
    .post(createLocalUser)
    .delete(deleteUser);

export default router;
