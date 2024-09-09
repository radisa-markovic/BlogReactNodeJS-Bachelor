import { Router } from 'express';

import * as postController from '../controllers/post';
import * as postValidator from '../validators/post';
import { checkJwt } from '../middleware/jwtAuth';
import { multerUploadMiddleware } from '../util/multer';

const router = Router();
router.get(
    "/", 
    postValidator.validateGetPosts(),
    postController.getPosts
);
router.get(
    "/:postId", 
    postValidator.validateId(),
    postController.getPost
);
router.post(
    "/create", 
    checkJwt,
    multerUploadMiddleware.single('coverImage'),
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
router.post(
    "/addReaction",
    postController.addReaction
);

export default router;