// Calculate fare based on distance, duration, and ride type
const calculateFare = (distance, duration, rideType = 'standard') => {
    const baseFares = {
      standard: 5.00,
      premium: 8.00,
    };
  
    const perKmRates = {
      standard: 2.50,
      premium: 3.75,
    };
  
    const perMinuteRates = {
      standard: 0.30,
      premium: 0.45,
    };
  
    const baseFare = baseFares[rideType] || baseFares.standard;
    const perKm = perKmRates[rideType] || perKmRates.standard;
    const perMinute = perMinuteRates[rideType] || perMinuteRates.standard;
  
    const distanceCost = distance * perKm;
    const timeCost = duration * perMinute;
    const total = baseFare + distanceCost + timeCost;
  
    // Round to 2 decimal places
    return Math.round(total * 100) / 100;
  };
  
  // Calculate estimated duration based on distance and traffic
  const calculateEstimatedDuration = (distance, trafficFactor = 1.2) => {
    const averageSpeed = 30; // km/h in urban areas
    const baseTime = (distance / averageSpeed) * 60; // Convert to minutes
    return Math.round(baseTime * trafficFactor);
  };
  
  // Calculate surge multiplier based on demand
  const calculateSurgeMultiplier = (demandLevel) => {
    const multipliers = {
      low: 1.0,
      medium: 1.2,
      high: 1.5,
      very_high: 2.0,
    };
  
    return multipliers[demandLevel] || multipliers.low;
  };
  
  module.exports = {
    calculateFare,
    calculateEstimatedDuration,
    calculateSurgeMultiplier,
  };