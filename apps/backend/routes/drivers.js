const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

// Update driver location
router.post('/location', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, heading, is_online } = req.body;
    const driverId = req.user.id;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const { data: location, error } = await supabase
      .from('driver_locations')
      .upsert({
        driver_id: driverId,
        latitude,
        longitude,
        heading,
        is_online: is_online !== undefined ? is_online : true,
        last_updated: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Location updated',
      data: location,
    });
  } catch (error) {
    console.error('Update driver location error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get nearby ride requests
router.get('/nearby-rides', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;
    const driverId = req.user.id;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Get driver's current location
    const { data: driverLocation } = await supabase
      .from('driver_locations')
      .select('*')
      .eq('driver_id', driverId)
      .single();

    if (!driverLocation || !driverLocation.is_online) {
      return res.json({
        success: true,
        data: [],
        message: 'Driver is offline'
      });
    }

    // Get nearby ride requests
    const { data: rides, error } = await supabase
      .from('rides')
      .select(`
        *,
        passenger:users!rides_passenger_id_fkey(*)
      `)
      .eq('status', 'requested')
      .limit(20);

    if (error) throw error;

    // Filter rides by distance (in production, this would be done in the database)
    const nearbyRides = rides.filter(ride => {
      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        ride.pickup_latitude,
        ride.pickup_longitude
      );
      return distance <= parseFloat(radius);
    });

    res.json({
      success: true,
      data: nearbyRides,
    });
  } catch (error) {
    console.error('Get nearby rides error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Accept a ride
router.post('/accept-ride', authenticateToken, async (req, res) => {
  try {
    const { rideId } = req.body;
    const driverId = req.user.id;

    if (!rideId) {
      return res.status(400).json({ error: 'Ride ID is required' });
    }

    // Check if ride exists and is available
    const { data: ride, error: rideError } = await supabase
      .from('rides')
      .select('*')
      .eq('id', rideId)
      .eq('status', 'requested')
      .single();

    if (rideError) {
      if (rideError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Ride not found or already taken' });
      }
      throw rideError;
    }

    // Update ride with driver info
    const { data: updatedRide, error } = await supabase
      .from('rides')
      .update({
        driver_id: driverId,
        status: 'accepted',
      })
      .eq('id', rideId)
      .select(`
        *,
        passenger:users!rides_passenger_id_fkey(*),
        driver:users!rides_driver_id_fkey(*)
      `)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Ride accepted successfully',
      data: updatedRide,
    });
  } catch (error) {
    console.error('Accept ride error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router;