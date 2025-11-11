-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  related_entity_type TEXT, -- e.g., 'ride', 'payment'
  related_entity_id UUID, -- ID of the related entity
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Add comments to tables for documentation
COMMENT ON TABLE users IS 'Stores both passenger and driver user accounts';
COMMENT ON TABLE driver_profiles IS 'Stores driver verification documents and vehicle information';
COMMENT ON TABLE rides IS 'Stores ride requests and their status';
COMMENT ON TABLE driver_locations IS 'Stores real-time driver locations for matching';
COMMENT ON TABLE driver_payments IS 'Stores driver commission payments';
COMMENT ON TABLE notifications IS 'Stores user notifications for ride updates and system messages';