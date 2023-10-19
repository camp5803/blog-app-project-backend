import express from 'express';
import { keywordController } from '@/controller';
import { isAuthenticated, isAuthorized } from "@/middleware";

const router = express.Router();

router.route('/keywords')
    .get(isAuthenticated, keywordController.getKeywords)
    .post(isAuthorized, keywordController.createMyKeyword)
    .delete(isAuthorized, keywordController.dissociateMyKeyword);

router.get('/keywords/discussions', isAuthorized, keywordController.getMyCategories);
router.get('/keywords/search', keywordController.highlightKeywords);
router.get('/keywords/:id', keywordController.getKeywordsById);

export default router;