import express from 'express';
import { authController } from '@/controller';
import { isAuthenticated } from "@/middleware";

const router = express.Router();

router.post('/auth/login', authController.createAuth);
router.post('/auth/refresh', isAuthenticated, authController.reissueAccessToken);

router.post('/auth/:type', authController.socialCallbackHandler);

export default router;