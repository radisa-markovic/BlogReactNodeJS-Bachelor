import { Router } from 'express';

import * as userController from '../controllers/user';
import * as userValidator from '../validators/user';

const router = Router();

router.get("/", userController.getUsers);
router.get(
    "/:userId",
    userValidator.validateID(),
    userController.getUser
);
router.post(
    "/create", 
    userValidator.validateUser(),
    userController.createUser
);
/**
 * need better reasoning: someone may update one element of
 * user data, and reuse the rest of unchanged fields
 */
router.patch(
    "/:userId",
    userValidator.validateID(),
    userValidator.validateUser(),
    userController.updateUser
);
router.delete(
    "/:userId",
    userValidator.validateID(),
    userController.deleteUser
);

router.post(
    "/login", 
    userValidator.validateLoginData(),
    userController.login
);

export default router;