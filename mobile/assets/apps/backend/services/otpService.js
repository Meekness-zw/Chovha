// In production, you would integrate with services like:
// - Twilio
// - MessageBird
// - Amazon SNS
// - etc.

// For development, we'll simulate OTP service
const otpStore = new Map();

const sendOTP = async (phone) => {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP with expiration (10 minutes)
  otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });

  // In production, you would send the OTP via SMS
  console.log(`OTP for ${phone}: ${otp}`); // Remove this in production
  
  return {
    success: true,
    message: 'OTP sent successfully',
    // In production, you might return a message ID or other tracking info
  };
};

const verifyOTP = async (phone, otp) => {
  const stored = otpStore.get(phone);
  
  if (!stored) {
    return { valid: false, message: 'OTP not found or expired' };
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phone);
    return { valid: false, message: 'OTP expired' };
  }

  if (stored.otp !== otp) {
    return { valid: false, message: 'Invalid OTP' };
  }

  // OTP is valid, remove it from storage
  otpStore.delete(phone);
  
  return { valid: true, message: 'OTP verified successfully' };
};

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(phone);
    }
  }
}, 60 * 1000); // Run every minute

module.exports = {
  sendOTP,
  verifyOTP,
};