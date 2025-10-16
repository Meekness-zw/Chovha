const Joi = require('joi');

const authValidation = {
  sendOTP: Joi.object({
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  }),

  verifyOTP: Joi.object({
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
    userData: Joi.object({
      firstName: Joi.string().min(1).max(50),
      lastName: Joi.string().min(1).max(50),
      email: Joi.string().email(),
      userType: Joi.string().valid('passenger', 'driver').required(),
    }).optional(),
  }),
};

const rideValidation = {
  requestRide: Joi.object({
    pickup: Joi.object({
      address: Joi.string().required(),
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    }).required(),
    destination: Joi.object({
      address: Joi.string().required(),
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    }).required(),
    rideType: Joi.string().valid('standard', 'premium').default('standard'),
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid(
      'requested', 
      'accepted', 
      'driver_en_route', 
      'arrived', 
      'in_progress', 
      'completed', 
      'cancelled'
    ).required(),
  }),
};

const driverValidation = {
  updateLocation: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    heading: Joi.number().min(0).max(360).optional(),
    is_online: Joi.boolean().optional(),
  }),

  acceptRide: Joi.object({
    rideId: Joi.string().uuid().required(),
  }),
};

const paymentValidation = {
  processPayment: Joi.object({
    rideId: Joi.string().uuid().required(),
    amount: Joi.number().min(0).required(),
    commissionRate: Joi.number().min(0).max(1).default(0.15),
  }),
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    next();
  };
};

module.exports = {
  authValidation,
  rideValidation,
  driverValidation,
  paymentValidation,
  validate,
};