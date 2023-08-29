import express from 'express';
import { createLocalUser, deleteUser } from '@/controller/index';

const router = express.Router();

router.route('/users')
    .post(createLocalUser)
    .delete(deleteUser);

export default router;
