import express from 'express';
import { 
    createAuth, 
    reissueAccessToken,
    createSocialAuth,
    socialCallbackHandler
} from '@/controller/index';

const router = express.Router();

router.post('/auth/login', createAuth);
router.post('/auth/refresh', reissueAccessToken);

router.get('/auth/callback/:type', socialCallbackHandler); // OAuth에서 callback 받을 경로
router.get('/auth/:type', createSocialAuth); // OAuth 인증을 위한 경로

export default router;