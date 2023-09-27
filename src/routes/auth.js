import express from 'express';
import { authController } from '@/controller';
import { isAuthorized } from "@/middleware";

const router = express.Router();

router.get('/auth/logout', isAuthorized, authController.logout);
router.post('/auth/login', authController.createAuth);
router.post('/auth/refresh', isAuthorized, authController.reissueAccessToken);

router.post('/auth/:type', authController.socialCallbackHandler);

export default router;