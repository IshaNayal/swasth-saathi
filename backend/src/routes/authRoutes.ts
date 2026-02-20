import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/auth/send-otp', authController.sendOTP);
router.post('/auth/verify-otp', authController.verifyOTP);

export default router;
