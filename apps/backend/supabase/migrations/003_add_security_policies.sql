-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Driver profiles policies
CREATE POLICY "Drivers can view own profile" ON driver_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Drivers can update own profile" ON driver_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Rides policies
CREATE POLICY "Passengers can view own rides" ON rides
  FOR SELECT USING (auth.uid() = passenger_id);

CREATE POLICY "Drivers can view assigned rides" ON rides
  FOR SELECT USING (auth.uid() = driver_id);

CREATE POLICY "Passengers can create rides" ON rides
  FOR INSERT WITH CHECK (auth.uid() = passenger_id);

CREATE POLICY "Drivers can update assigned rides" ON rides
  FOR UPDATE USING (auth.uid() = driver_id);

-- Driver locations policies
CREATE POLICY "Drivers can view own location" ON driver_locations
  FOR SELECT USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can update own location" ON driver_locations
  FOR ALL USING (auth.uid() = driver_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);