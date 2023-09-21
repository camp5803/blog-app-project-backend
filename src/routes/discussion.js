import express from 'express';
const router = express.Router();
import {validateDiscussionId, isAuthorized} from "@/middleware";
import {discussionController} from '@/controller/discussion.controller';

router.get('/discussions/all/:sort', discussionController.getDiscussionByPage);
router.post('/discussions', isAuthorized, discussionController.createDiscussion);
router.get('/discussions/:discussionId', validateDiscussionId, discussionController.getDiscussionByDetail);
router.patch('/discussions/:discussionId', validateDiscussionId, isAuthorized, discussionController.updateDiscussion);
router.delete('/discussions/:discussionId', validateDiscussionId, isAuthorized, discussionController.deleteDiscussion);
router.post('/discussions/:discussionId/bookmark', validateDiscussionId, isAuthorized, discussionController.toggleBookmark);
router.post('/discussions/:discussionId/like', validateDiscussionId, isAuthorized, discussionController.toggleLike);
router.post('/discussions/:discussionId/participation', validateDiscussionId, isAuthorized, discussionController.createDiscussionUser);

export default router;