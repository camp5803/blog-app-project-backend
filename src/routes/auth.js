import express from 'express';
import { createAuth, updateAuth } from '@/controller/index';

const router = express.Router();

router.route('/auth/create').post(createAuth);
router.route('/auth/update').post(updateAuth);

export default router;
