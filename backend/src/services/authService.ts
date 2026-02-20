import prisma from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export async function sendOTP(phone_number: string, language?: string) {
  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otp_hash = await bcrypt.hash(otp, 10);
  const expires_at = new Date(Date.now() + ENV.OTP_EXPIRY_MINUTES * 60000);

  // Find or create user
  let user = await prisma.user.findUnique({ where: { phone_number } });
  if (!user) {
    user = await prisma.user.create({ data: { phone_number, role: 'patient', language } });
  } else if (language) {
    await prisma.user.update({ where: { id: user.id }, data: { language } });
  }

  // Store OTP
  await prisma.oTP.create({
    data: {
      user_id: user.id,
      otp_hash,
      expires_at,
    },
  });

  // Placeholder for SMS integration (Twilio/MSG91)
  // sendSMS(phone_number, otp);

  return { success: true };
}

export async function verifyOTP(phone_number: string, otp: string) {
  const user = await prisma.user.findUnique({ where: { phone_number } });
  if (!user) return { success: false, error: 'User not found' };

  const otpRecord = await prisma.oTP.findFirst({
    where: {
      user_id: user.id,
      expires_at: { gt: new Date() },
    },
    orderBy: { expires_at: 'desc' },
  });
  if (!otpRecord) return { success: false, error: 'OTP expired' };

  const valid = await bcrypt.compare(otp, otpRecord.otp_hash);
  if (!valid) return { success: false, error: 'Invalid OTP' };

  // Issue JWT
  const token = jwt.sign({ userId: user.id, role: user.role }, ENV.JWT_SECRET, { expiresIn: '7d' });

  return { success: true, token, user };
}
