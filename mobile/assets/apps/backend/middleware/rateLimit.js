const { RateLimiterMemory } = require('rate-limiter-flexible');

// Rate limit for OTP requests
const otpRateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => `otp_${req.body.phone}`,
  points: 3, // 3 attempts
  duration: 300, // per 5 minutes
});

// Rate limit for general API requests
const apiRateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => `api_${req.ip}`,
  points: 100, // 100 requests
  duration: 900, // per 15 minutes
});

// Rate limit for ride requests
const rideRateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => `ride_${req.user?.id || req.ip}`,
  points: 10, // 10 ride requests
  duration: 300, // per 5 minutes
});

const rateLimitMiddleware = (limiter) => {
  return async (req, res, next) => {
    try {
      await limiter.consume(req.body.phone || req.ip || req.user?.id);
      next();
    } catch (rejRes) {
      res.status(429).json({
        error: 'Too many requests, please try again later.',
      });
    }
  };
};

module.exports = {
  otpRateLimiter,
  apiRateLimiter,
  rideRateLimiter,
  rateLimitMiddleware,
};