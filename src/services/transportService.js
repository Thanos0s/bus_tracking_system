import { supabase } from '../lib/supabase';

// Routes Service
export const routeService = {
  // Get all active routes
  async getRoutes() {
    try {
      const { data, error } = await supabase
        ?.from('routes')
        ?.select(`
          *,
          route_stops (
            *,
            bus_stops (*)
          )
        `)
        ?.eq('status', 'active')
        ?.order('route_number');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get route by ID with stops
  async getRouteById(routeId) {
    try {
      const { data, error } = await supabase
        ?.from('routes')
        ?.select(`
          *,
          route_stops (
            *,
            bus_stops (*)
          )
        `)
        ?.eq('id', routeId)
        ?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Create new route (admin/operator only)
  async createRoute(routeData) {
    try {
      const { data, error } = await supabase
        ?.from('routes')
        ?.insert(routeData)
        ?.select()
        ?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Bus Service
export const busService = {
  // Get all active buses
  async getBuses() {
    try {
      const { data, error } = await supabase
        ?.from('buses')
        ?.select(`
          *,
          driver:user_profiles (
            id,
            full_name,
            phone
          )
        `)
        ?.eq('status', 'active')
        ?.order('bus_number');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get real-time bus location
  async getBusLocation(busId) {
    try {
      const { data, error } = await supabase
        ?.from('real_time_locations')
        ?.select('*')
        ?.eq('bus_id', busId)
        ?.order('last_updated', { ascending: false })
        ?.limit(1)
        ?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update bus location (operator only)
  async updateBusLocation(busId, locationData) {
    try {
      const { data, error } = await supabase
        ?.from('real_time_locations')
        ?.insert({
          bus_id: busId,
          ...locationData,
          last_updated: new Date()?.toISOString()
        })
        ?.select()
        ?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Schedule Service
export const scheduleService = {
  // Get schedules for a route
  async getRouteSchedules(routeId) {
    try {
      const { data, error } = await supabase
        ?.from('schedules')
        ?.select(`
          *,
          routes (*),
          buses (*)
        `)
        ?.eq('route_id', routeId)
        ?.eq('is_active', true)
        ?.order('departure_time');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get today's schedules for a bus stop
  async getStopSchedules(stopId) {
    try {
      const today = new Date()?.getDay();
      const { data, error } = await supabase
        ?.from('schedules')
        ?.select(`
          *,
          routes (*),
          buses (*),
          routes!inner (
            route_stops!inner (
              stop_id,
              stop_order,
              estimated_arrival_time
            )
          )
        `)
        ?.contains('days_of_week', [today])
        ?.eq('is_active', true)
        ?.eq('routes.route_stops.stop_id', stopId)
        ?.order('departure_time');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Emergency Service
export const emergencyService = {
  // Get active emergency alerts
  async getActiveAlerts() {
    try {
      const { data, error } = await supabase
        ?.from('emergency_alerts')
        ?.select(`
          *,
          buses (*),
          routes (*),
          reported_by:user_profiles!emergency_alerts_reported_by_fkey (
            full_name,
            phone
          )
        `)
        ?.eq('status', 'active')
        ?.order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Report emergency
  async reportEmergency(alertData) {
    try {
      const { data, error } = await supabase
        ?.from('emergency_alerts')
        ?.insert(alertData)
        ?.select()
        ?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update emergency status (operator/admin only)
  async updateAlertStatus(alertId, status, assignedTo = null) {
    try {
      const updateData = {
        status,
        updated_at: new Date()?.toISOString()
      };
      
      if (assignedTo) updateData.assigned_to = assignedTo;
      if (status === 'resolved') updateData.resolved_at = new Date()?.toISOString();

      const { data, error } = await supabase
        ?.from('emergency_alerts')
        ?.update(updateData)
        ?.eq('id', alertId)
        ?.select()
        ?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Service Alerts
export const serviceAlertService = {
  // Get active service alerts
  async getActiveServiceAlerts() {
    try {
      const { data, error } = await supabase
        ?.from('service_alerts')
        ?.select('*')
        ?.eq('is_active', true)
        ?.or('end_time.is.null,end_time.gt.now()')
        ?.order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Create service alert (admin/operator only)
  async createServiceAlert(alertData) {
    try {
      const { data, error } = await supabase
        ?.from('service_alerts')
        ?.insert(alertData)
        ?.select()
        ?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Trip Planning Service
export const tripService = {
  // Get user's trip history
  async getUserTripHistory(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        ?.from('trip_history')?.select(`*,routes (*),buses (*),boarding_stop:bus_stops!trip_history_boarding_stop_id_fkey (*),alighting_stop:bus_stops!trip_history_alighting_stop_id_fkey (*)`)?.eq('passenger_id', userId)?.order('created_at', { ascending: false })
        ?.limit(limit);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Record a trip
  async recordTrip(tripData) {
    try {
      const { data, error } = await supabase
        ?.from('trip_history')
        ?.insert(tripData)
        ?.select()
        ?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Bus Stops Service
export const busStopService = {
  // Get all active bus stops
  async getBusStops() {
    try {
      const { data, error } = await supabase
        ?.from('bus_stops')
        ?.select('*')
        ?.eq('is_active', true)
        ?.order('name');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get bus stop by ID with route information
  async getBusStopById(stopId) {
    try {
      const { data, error } = await supabase
        ?.from('bus_stops')
        ?.select(`
          *,
          route_stops (
            *,
            routes (*)
          )
        `)
        ?.eq('id', stopId)
        ?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get nearby bus stops (requires coordinates)
  async getNearbyStops(latitude, longitude, radiusKm = 5) {
    try {
      // This would typically use a PostGIS function, but for now we'll get all stops
      // and filter on the client side
      const { data, error } = await supabase
        ?.from('bus_stops')
        ?.select('*')
        ?.eq('is_active', true);
      
      if (error) throw error;

      // Simple distance calculation (not perfectly accurate but functional)
      const nearbyStops = data?.filter(stop => {
        if (!stop?.latitude || !stop?.longitude) return false;
        
        const distance = Math.sqrt(
          Math.pow(stop?.latitude - latitude, 2) + 
          Math.pow(stop?.longitude - longitude, 2)
        ) * 111; // Rough km conversion
        
        return distance <= radiusKm;
      }) || [];

      return { data: nearbyStops, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Real-time subscriptions
export const realtimeService = {
  // Subscribe to bus location updates
  subscribeToBusLocations(callback) {
    return supabase
      ?.channel('bus_locations')
      ?.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'real_time_locations' 
        },
        callback
      )
      ?.subscribe();
  },

  // Subscribe to emergency alerts
  subscribeToEmergencyAlerts(callback) {
    return supabase
      ?.channel('emergency_alerts')
      ?.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'emergency_alerts' 
        },
        callback
      )
      ?.subscribe();
  },

  // Subscribe to service alerts
  subscribeToServiceAlerts(callback) {
    return supabase
      ?.channel('service_alerts')
      ?.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'service_alerts' 
        },
        callback
      )
      ?.subscribe();
  },

  // Unsubscribe from channel
  unsubscribe(channel) {
    if (channel) {
      return supabase?.removeChannel(channel);
    }
  }
};
