const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { sendOTP, verifyOTP } = require('../services/otpService');
const { generateToken } = require('../utils/helpers');

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Validate phone format
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // In production, you would integrate with Twilio or similar service
    const result = await sendOTP(phone);
    
    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      data: result 
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP and login/register
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp, userData } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    // Verify OTP (in production, verify with your OTP service)
    const verification = await verifyOTP(phone, otp);
    
    if (!verification.valid) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check if user exists
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    let user;

    if (userError || !existingUser) {
      // Create new user
      if (!userData) {
        return res.status(400).json({ error: 'User data required for new users' });
      }

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          phone,
          first_name: userData.firstName,
          last_name: userData.lastName,
          user_type: userData.userType,
          is_verified: true,
          ...(userData.email && { email: userData.email }),
        }])
        .select()
        .single();

      if (createError) {
        if (createError.code === '23505') { // Unique violation
          return res.status(400).json({ error: 'User with this phone already exists' });
        }
        throw createError;
      }
      user = newUser;
    } else {
      user = existingUser;
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Authentication successful',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;