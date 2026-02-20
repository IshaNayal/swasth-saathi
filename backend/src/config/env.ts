export const ENV = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  OTP_EXPIRY_MINUTES: 5,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  POSTGRES_URL: process.env.POSTGRES_URL || '',
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || 'http://ml-service:8000',
};
