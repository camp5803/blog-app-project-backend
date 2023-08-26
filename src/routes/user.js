import express from 'express';
import { createLocalUser } from '@/controller/index';

const router = express.Router();

router.route('/user').post(createLocalUser);

// 예시 제거

export default router;
