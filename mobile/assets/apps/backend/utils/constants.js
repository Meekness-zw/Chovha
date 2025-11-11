module.exports = {
    RIDE_STATUS: {
      REQUESTED: 'requested',
      ACCEPTED: 'accepted',
      DRIVER_EN_ROUTE: 'driver_en_route',
      ARRIVED: 'arrived',
      IN_PROGRESS: 'in_progress',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
    },
  
    USER_TYPES: {
      PASSENGER: 'passenger',
      DRIVER: 'driver',
    },
  
    RIDE_TYPES: {
      STANDARD: 'standard',
      PREMIUM: 'premium',
    },
  
    PAYMENT_STATUS: {
      PENDING: 'pending',
      PAID: 'paid',
      FAILED: 'failed',
    },
  
    NOTIFICATION_TYPES: {
      INFO: 'info',
      SUCCESS: 'success',
      WARNING: 'warning',
      ERROR: 'error',
    },
  
    // Commission rates
    COMMISSION_RATES: {
      STANDARD: 0.15, // 15%
      PREMIUM: 0.20, // 20%
    },
  
    // Distance in kilometers for pricing tiers
    PRICING: {
      BASE_FARE: {
        STANDARD: 5.00,
        PREMIUM: 8.00,
      },
      PER_KM: {
        STANDARD: 2.50,
        PREMIUM: 3.75,
      },
      PER_MINUTE: {
        STANDARD: 0.30,
        PREMIUM: 0.45,
      },
    },
  
    // Search radius in kilometers
    SEARCH_RADIUS: 5,
  
    // OTP configuration
    OTP_CONFIG: {
      LENGTH: 6,
      EXPIRY_MINUTES: 10,
      MAX_ATTEMPTS: 3,
    },
  };