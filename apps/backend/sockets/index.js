module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
  
      // Driver goes online
      socket.on('driver-online', (data) => {
        const { driverId, location } = data;
        socket.join(`driver-${driverId}`);
        socket.join('online-drivers');
        console.log(`Driver ${driverId} is now online`);
        
        // Broadcast to passengers that a driver is available
        socket.broadcast.emit('driver-available', {
          driverId,
          location,
        });
      });
  
      // Driver goes offline
      socket.on('driver-offline', (data) => {
        const { driverId } = data;
        socket.leave(`driver-${driverId}`);
        socket.leave('online-drivers');
        console.log(`Driver ${driverId} is now offline`);
      });
  
      // Passenger requests a ride
      socket.on('ride-request', (data) => {
        const { rideId, pickup, destination } = data;
        console.log(`New ride request: ${rideId}`);
        
        // Broadcast to all online drivers
        socket.to('online-drivers').emit('new-ride-request', {
          rideId,
          pickup,
          destination,
          timestamp: new Date().toISOString(),
        });
      });
  
      // Driver accepts a ride
      socket.on('ride-accepted', (data) => {
        const { rideId, driverId, passengerId } = data;
        console.log(`Driver ${driverId} accepted ride ${rideId}`);
        
        // Notify the specific passenger
        socket.to(`passenger-${passengerId}`).emit('driver-assigned', {
          rideId,
          driverId,
          timestamp: new Date().toISOString(),
        });
      });
  
      // Location updates
      socket.on('location-update', (data) => {
        const { userId, userType, location } = data;
        const room = userType === 'driver' ? `driver-${userId}` : `passenger-${userId}`;
        
        // Broadcast location to relevant parties
        socket.to(room).emit('location-updated', {
          userId,
          userType,
          location,
          timestamp: new Date().toISOString(),
        });
      });
  
      // Ride status updates
      socket.on('ride-status-update', (data) => {
        const { rideId, status, userId } = data;
        
        // Notify both driver and passenger
        socket.to(`ride-${rideId}`).emit('ride-status-changed', {
          rideId,
          status,
          timestamp: new Date().toISOString(),
        });
      });
  
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  };