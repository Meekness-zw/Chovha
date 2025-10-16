const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

// Get driver payment history
router.get('/driver', authenticateToken, async (req, res) => {
  try {
    const driverId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: payments, error, count } = await supabase
      .from('driver_payments')
      .select(`
        *,
        ride:rides(*)
      `, { count: 'exact' })
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Calculate totals
    const totalEarnings = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    const totalCommission = payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) * parseFloat(payment.commission_rate)), 0);
    const netEarnings = totalEarnings - totalCommission;

    res.json({
      success: true,
      data: payments,
      summary: {
        totalEarnings: totalEarnings.toFixed(2),
        totalCommission: totalCommission.toFixed(2),
        netEarnings: netEarnings.toFixed(2),
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get driver payments error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Process driver payment (simulated - in production, integrate with payment gateway)
router.post('/process', authenticateToken, async (req, res) => {
  try {
    const { rideId, amount, commissionRate = 0.15 } = req.body;
    const driverId = req.user.id;

    if (!rideId || !amount) {
      return res.status(400).json({ error: 'Ride ID and amount are required' });
    }

    // Verify the ride exists and belongs to the driver
    const { data: ride, error: rideError } = await supabase
      .from('rides')
      .select('*')
      .eq('id', rideId)
      .eq('driver_id', driverId)
      .single();

    if (rideError) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Check if payment already exists
    const { data: existingPayment } = await supabase
      .from('driver_payments')
      .select('*')
      .eq('ride_id', rideId)
      .single();

    if (existingPayment) {
      return res.status(400).json({ error: 'Payment already processed for this ride' });
    }

    // Create payment record
    const { data: payment, error } = await supabase
      .from('driver_payments')
      .insert([{
        driver_id: driverId,
        ride_id: rideId,
        amount: parseFloat(amount),
        commission_rate: parseFloat(commissionRate),
        status: 'paid',
        payment_date: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: payment,
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get payment summary for driver
router.get('/driver/summary', authenticateToken, async (req, res) => {
  try {
    const driverId = req.user.id;
    const { period = 'month' } = req.query; // day, week, month, year

    let dateFilter = new Date();
    switch (period) {
      case 'day':
        dateFilter.setDate(dateFilter.getDate() - 1);
        break;
      case 'week':
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case 'month':
        dateFilter.setMonth(dateFilter.getMonth() - 1);
        break;
      case 'year':
        dateFilter.setFullYear(dateFilter.getFullYear() - 1);
        break;
      default:
        dateFilter.setMonth(dateFilter.getMonth() - 1);
    }

    const { data: payments, error } = await supabase
      .from('driver_payments')
      .select('*')
      .eq('driver_id', driverId)
      .gte('created_at', dateFilter.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    const summary = {
      totalRides: payments.length,
      totalEarnings: 0,
      totalCommission: 0,
      netEarnings: 0,
    };

    payments.forEach(payment => {
      const amount = parseFloat(payment.amount);
      const commission = amount * parseFloat(payment.commission_rate);
      
      summary.totalEarnings += amount;
      summary.totalCommission += commission;
      summary.netEarnings += (amount - commission);
    });

    // Format numbers
    Object.keys(summary).forEach(key => {
      if (typeof summary[key] === 'number') {
        summary[key] = parseFloat(summary[key].toFixed(2));
      }
    });

    res.json({
      success: true,
      data: summary,
      period,
    });
  } catch (error) {
    console.error('Get payment summary error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;