import { Router } from 'express';

import * as tagController from '../controllers/tag';
import { checkJwt } from '../middleware/jwtAuth';

const router = Router();

router.get(
    "/",
    checkJwt,
    tagController.getAll
);
router.post(
    "/create", 
    tagController.create
);

export default router;