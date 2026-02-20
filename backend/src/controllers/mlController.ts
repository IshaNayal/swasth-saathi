import { Request, Response } from 'express';
import * as mlService from '../services/mlService';

export async function analyzeSymptoms(req: Request, res: Response) {
  const { symptoms, severity, duration_days, age, chronic_conditions } = req.body;
  if (!symptoms || !severity || !duration_days || !age) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const result = await mlService.analyzeSymptoms({ symptoms, severity, duration_days, age, chronic_conditions });
  res.json(result);
}
