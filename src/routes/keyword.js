import express from 'express';
import { keywordController } from '@/controller';
import { isAuthenticated, isAuthorized } from "@/middleware";

const router = express.Router();

router.route('/keywords')
    .get(isAuthenticated, keywordController.getKeywords)
    .post(isAuthorized, keywordController.createMyKeyword)
    .delete(isAuthorized, keywordController.dissociateMyKeyword);

router.get('/keywords/me');
router.get('/keywords/me/:value');
router.get('/keywords/:value', keywordController.highlightKeywords);

export default router;