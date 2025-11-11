const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');
const { calculateFare, calculateDistance } = require('../utils/calculations');

// Request a ride
router.post('/request', authenticateToken, async (req, res) => {
  try {
    const { pickup, destination, rideType } = req.body;
    const passengerId = req.user.id;

    if (!pickup || !destination) {
      return res.status(400).json({ error: 'Pickup and destination are required' });
    }

    // Calculate distance and fare
    const distance = calculateDistance(
      pickup.latitude,
      pickup.longitude,
      destination.latitude,
      destination.longitude
    );

    const fare = calculateFare(distance, 15, rideType); // 15 mins estimated

    // Create ride
    const { data: ride, error } = await supabase
      .from('rides')
      .insert([{
        passenger_id: passengerId,
        pickup_address: pickup.address,
        pickup_latitude: pickup.latitude,
        pickup_longitude: pickup.longitude,
        destination_address: destination.address,
        destination_latitude: destination.latitude,
        destination_longitude: destination.longitude,
        fare_amount: fare,
        distance_km: distance,
        estimated_duration: 15,
        status: 'requested',
      }])
      .select(`
        *,
        passenger:users!rides_passenger_id_fkey(*)
      `)
      .single();

    if (error) throw error;

    // Find nearby drivers
    const { data: nearbyDrivers } = await supabase
      .rpc('get_nearby_drivers', {
        user_lat: pickup.latitude,
        user_lng: pickup.longitude,
        max_distance: 5
      });

    // In production, you would send real-time notifications to drivers
    console.log(`Notifying ${nearbyDrivers?.length || 0} drivers about ride ${ride.id}`);

    res.json({
      success: true,
      message: 'Ride requested successfully',
      data: {
        ride,
        nearbyDrivers: nearbyDrivers || [],
      },
    });
  } catch (error) {
    console.error('Request ride error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get ride details
router.get('/:rideId', authenticateToken, async (req, res) => {
  try {
    const { rideId } = req.params;

    const { data: ride, error } = await supabase
      .from('rides')
      .select(`
        *,
        passenger:users!rides_passenger_id_fkey(*),
        driver:users!rides_driver_id_fkey(*)
      `)
      .eq('id', rideId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Ride not found' });
      }
      throw error;
    }

    // Check if user has permission to view this ride
    if (ride.passenger_id !== req.user.id && ride.driver_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this ride' });
    }

    res.json({
      success: true,
      data: ride,
    });
  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update ride status
router.patch('/:rideId/status', authenticateToken, async (req, res) => {
  try {
    const { rideId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const validStatuses = ['requested', 'accepted', 'driver_en_route', 'arrived', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Verify user has permission to update this ride
    const { data: existingRide, error: fetchError } = await supabase
      .from('rides')
      .select('*')
      .eq('id', rideId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Ride not found' });
      }
      throw fetchError;
    }

    if (existingRide.passenger_id !== userId && existingRide.driver_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this ride' });
    }

    const updates = { status };
    
    // Set timestamps based on status
    if (status === 'in_progress') {
      updates.started_at = new Date().toISOString();
    } else if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data: ride, error } = await supabase
      .from('rides')
      .update(updates)
      .eq('id', rideId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Ride status updated',
      data: ride,
    });
  } catch (error) {
    console.error('Update ride status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's ride history
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify the user is requesting their own history
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { data: rides, error } = await supabase
      .from('rides')
      .select(`
        *,
        passenger:users!rides_passenger_id_fkey(*),
        driver:users!rides_driver_id_fkey(*)
      `)
      .or(`passenger_id.eq.${userId},driver_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({
      success: true,
      data: rides,
    });
  } catch (error) {
    console.error('Get ride history error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;