import { Router } from 'express';

import * as tagController from '../controllers/tag';

const router = Router();

router.post(
    "/create", 
    tagController.create
);

export default router;