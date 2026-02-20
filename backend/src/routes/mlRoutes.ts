import { Router } from 'express';
import * as mlController from '../controllers/mlController';

const router = Router();

router.post('/analyze-symptoms', mlController.analyzeSymptoms);

export default router;
