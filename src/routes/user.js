import express from 'express';
import { createUser } from '@/controller/index';

const router = express.Router();

router.route('/user').post()

// 예시 제거

export default router;
