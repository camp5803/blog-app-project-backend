import express from 'express';
import {discussionController} from '@/controller/discussion.controller';

const router = express.Router();
import { isAuthenticated, isAuthorized } from "@/middleware";

router.get('/discussions/all/:sort', discussionController.getDiscussionByPage);
router.post('/discussions', isAuthorized, discussionController.createDiscussion);
router.get('/discussions/:discussionId', discussionController.getDiscussionByDetail);
router.patch('/discussions/:discussionId', isAuthorized, discussionController.updateDiscussion);
router.delete('/discussions/:discussionId', isAuthorized, discussionController.deleteDiscussion);
router.post('/discussions/:discussionId/bookmark', isAuthorized, discussionController.toggleBookmark);
router.post('/discussions/:discussionId/like', isAuthorized, discussionController.toggleLike);

export default router;