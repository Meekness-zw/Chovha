const { supabase } = require('../config/supabase');

class NotificationService {
  // Send ride request to nearby drivers
  static async notifyNearbyDrivers(rideId, pickupLocation, maxDistance = 5) {
    try {
      const { data: nearbyDrivers, error } = await supabase
        .rpc('get_nearby_drivers', {
          user_lat: pickupLocation.latitude,
          user_lng: pickupLocation.longitude,
          max_distance: maxDistance
        });

      if (error) throw error;

      // In production, you would send push notifications to these drivers
      // For now, we'll just log and use WebSockets
      console.log(`Notifying ${nearbyDrivers.length} drivers about ride ${rideId}`);

      return {
        success: true,
        notifiedDrivers: nearbyDrivers.length,
        driverIds: nearbyDrivers.map(d => d.user_id),
      };
    } catch (error) {
      console.error('Error notifying drivers:', error);
      return { success: false, error: error.message };
    }
  }

  // Send notification to specific user
  static async sendToUser(userId, title, message, type = 'info') {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          title,
          message,
          type,
          is_read: false,
        }])
        .select()
        .single();

      if (error) throw error;

      // In production, send push notification via FCM/APNS
      console.log(`Notification sent to user ${userId}: ${title} - ${message}`);

      return { success: true, notification };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, notification };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user notifications
  static async getUserNotifications(userId, limit = 20) {
    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { success: true, notifications };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = NotificationService;