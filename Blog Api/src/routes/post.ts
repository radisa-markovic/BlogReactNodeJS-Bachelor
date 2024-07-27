import { Router } from 'express';
import { body, param } from 'express-validator';

import * as postController from '../controllers/post';
import * as postValidator from '../validators/post';

const router = Router();

router.get("/", postController.getPosts);
router.get(
    "/:postId", 
    postValidator.validateId(),
    postController.getPost
);
router.post(
    "/create", 
    postValidator.validatePost(),
    postController.addPost
);
router.patch(
    "/:postId", 
    postValidator.validatePost(),
    postController.updatePost
);
router.delete(
    "/:postId", 
    postValidator.validateId(),
    postController.deletePost
);

export default router;