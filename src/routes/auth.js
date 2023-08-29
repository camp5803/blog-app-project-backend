import express from 'express';
import { createAuth, reissueAccessToken } from '@/controller/index';

const router = express.Router();

router.post('/auth/login', createAuth);
router.post('/auth/refresh', reissueAccessToken);

export default router;