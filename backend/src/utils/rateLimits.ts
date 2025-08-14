import rateLimit from 'express-rate-limit'

export const rateLimitApp = rateLimit({
  message: { error: 'Слишком много запросов, пожалуйста, попробуйте немного позже.' },
  standardHeaders: true,
  legacyHeaders: false,
  windowMs: 15 * 60 * 1000,
  max: 40,
});