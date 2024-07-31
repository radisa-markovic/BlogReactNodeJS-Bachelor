import { Router } from 'express';

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
router.post(
    "/addComment/:postId", 
    postController.addComment
);

export default router;