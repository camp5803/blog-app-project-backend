import express from 'express';
import { notificationController } from '@/controller/notification.controller';
import { isAuthorized } from "@/middleware";

const router = express.Router();

router.get('/notification', isAuthorized, notificationController.initialize);

export default router;