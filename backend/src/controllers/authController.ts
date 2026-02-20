import { Request, Response } from 'express';
import * as authService from '../services/authService';

export async function sendOTP(req: Request, res: Response) {
  const { phone_number, language } = req.body;
  if (!phone_number) return res.status(400).json({ error: 'Phone number required' });
  const result = await authService.sendOTP(phone_number, language);
  res.json(result);
}

export async function verifyOTP(req: Request, res: Response) {
  const { phone_number, otp } = req.body;
  if (!phone_number || !otp) return res.status(400).json({ error: 'Phone number and OTP required' });
  const result = await authService.verifyOTP(phone_number, otp);
  if (!result.success) return res.status(401).json({ error: result.error });
  res.json({ token: result.token, user: result.user });
}
