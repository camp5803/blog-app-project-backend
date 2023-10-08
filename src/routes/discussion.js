import express from 'express';
const router = express.Router();
import {validateDiscussionId, isAuthorized} from "@/middleware";
import {discussionController} from '@/controller/discussion.controller';

router.get('/discussions/previews/me', isAuthorized, discussionController.getDiscussionById);
router.get('/discussions/previews/neighbors', isAuthorized, discussionController.getNeighborsDiscussion);
router.get('/discussions/previews/:id', discussionController.getDiscussionById);
router.get('/discussions/all/:sort', discussionController.getDiscussionByPage);
router.post('/discussions', isAuthorized, discussionController.createDiscussion);
router.get('/discussions/:discussionId', validateDiscussionId, discussionController.getDiscussionByDetail);
router.patch('/discussions/:discussionId', validateDiscussionId, isAuthorized, discussionController.updateDiscussion);
router.delete('/discussions/:discussionId', validateDiscussionId, isAuthorized, discussionController.deleteDiscussion);
router.post('/discussions/:discussionId/like', validateDiscussionId, isAuthorized, discussionController.toggleLike);
// router.post('/discussions/:discussionId/participation', validateDiscussionId, isAuthorized, discussionController.createDiscussionUser);
router.delete('/discussions/:discussionId/participation', validateDiscussionId, isAuthorized, discussionController.deleteDiscussionUser);
router.get('/discussions/:discussionId/verification', validateDiscussionId, discussionController.verifyUser);

export default router;