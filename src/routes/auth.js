import express from 'express';
import { 
    createAuth, 
    reissueAccessToken,
    redirectOAuth,
    socialCallbackHandler
} from '@/controller/index';

const router = express.Router();

router.post('/auth/login', createAuth);
router.post('/auth/refresh', reissueAccessToken);

router.get('/auth/callback/:type', socialCallbackHandler); // OAuth에서 callback 받을 경로
router.get('/auth/:type', redirectOAuth); // OAuth Redirect를 해주는 경로

export default router;