import express from 'express';
import {
    createAuth,
    reissueAccessToken,
    socialCallbackHandler, socialCallbackHandler_tmp
} from '@/controller';
import { isAuthenticated } from "@/middleware";

const router = express.Router();

router.post('/auth/login', createAuth);
router.post('/auth/refresh', isAuthenticated, reissueAccessToken);

router.post('/auth/:type', socialCallbackHandler_tmp);

export default router;