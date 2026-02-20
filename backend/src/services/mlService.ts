import axios from 'axios';
import { ENV } from '../config/env';

export async function analyzeSymptoms(payload: any) {
  try {
    const response = await axios.post(
      `${ENV.ML_SERVICE_URL}/analyze-symptoms`,
      payload,
      { timeout: 5000 }
    );
    return response.data;
  } catch (error) {
    // Retry logic or fallback
    let details = '';
    if (error instanceof Error) {
      details = error.message;
    } else if (typeof error === 'string') {
      details = error;
    } else {
      details = JSON.stringify(error);
    }
    return { error: 'ML service unavailable', details };
  }
}
