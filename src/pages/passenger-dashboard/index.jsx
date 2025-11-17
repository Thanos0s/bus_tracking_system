import React, { useState, useEffect } from 'react';
import { Clock, Bus } from 'lucide-react';
import Header from '../../components/ui/Header';
import MapView from './components/MapView';
import SearchBar from './components/SearchBar';
import QuickActions from './components/QuickActions';
import NearbyStopsPanel from './components/NearbyStopsPanel';
import ServiceAlerts from './components/ServiceAlerts';
import { useAuth } from '../../contexts/AuthContext';
import { serviceAlertService, busService } from '../../services/transportService';

const PassengerDashboard = () => {
  const { user, userProfile } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [serviceAlerts, setServiceAlerts] = useState([]);
  const [activeBuses, setActiveBuses] = useState([]);
  const [upcomingDepartures, setUpcomingDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ... keep existing useEffect for time ...
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // Load service alerts
      const alertsResult = await serviceAlertService?.getActiveServiceAlerts();
      if (alertsResult?.error) {
        console.error('Error loading service alerts:', alertsResult?.error);
      } else {
        setServiceAlerts(alertsResult?.data || []);
      }

      // Load active buses
      const busesResult = await busService?.getBuses();
      if (busesResult?.error) {
        console.error('Error loading buses:', busesResult?.error);
      } else {
        setActiveBuses(busesResult?.data || []);
      }

      // For upcoming departures, we'll use mock data for now
      // In a real app, this would calculate based on current time and schedules
      setUpcomingDepartures([
        {
          route_number: 'R001',
          route_name: 'Downtown Express',
          departure_time: '08:15:00',
          destination: 'University Campus',
          estimated_delay: 2
        },
        {
          route_number: 'R002',
          route_name: 'Airport Shuttle',
          departure_time: '08:30:00',
          destination: 'Airport Terminal',
          estimated_delay: 0
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    return time?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTimeBasedGreeting = () => {
    const hour = currentTime?.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getTimeBasedGreeting()}, {userProfile?.full_name || user?.email?.split('@')?.[0] || 'Passenger'}!
                </h1>
                <p className="text-gray-600 mt-1">
                  Plan your journey and track buses in real-time
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-blue-600">
                    {formatTime(currentTime)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentTime?.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Service Alerts */}
        {serviceAlerts?.length > 0 && (
          <div className="mb-8">
            <ServiceAlerts alerts={serviceAlerts} />
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            onRouteSearch={(query) => {
              // Handle route search
              console.log('Route search:', query);
            }}
            onDestinationSelect={(destination) => {
              // Handle destination selection
              console.log('Destination selected:', destination);
            }}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions 
            onEmergencyAlert={() => {
              // Handle emergency alert
              console.log('Emergency alert triggered');
            }}
          />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Live Bus Tracking</h2>
                <p className="text-sm text-gray-600">Real-time bus locations and routes</p>
              </div>

              <div className="h-96">
                <MapView 
                  buses={activeBuses}
                  onBusSelect={(bus) => {
                    // Handle bus selection
                    console.log('Bus selected:', bus);
                  }}
                  onLocationUpdate={(location) => {
                    // Handle location update
                    console.log('Location updated:', location);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Upcoming Departures */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Next Departures
                </h3>
              </div>
              <div className="p-4">
                {upcomingDepartures?.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingDepartures?.map((departure, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">
                            {departure?.route_number} - {departure?.route_name}
                          </div>
                          <div className="text-sm text-gray-600">
                            to {departure?.destination}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-lg text-blue-600">
                            {departure?.departure_time}
                          </div>
                          {departure?.estimated_delay > 0 && (
                            <div className="text-xs text-red-600">
                              +{departure?.estimated_delay}min delay
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No upcoming departures
                  </p>
                )}
              </div>
            </div>

            {/* Nearby Stops */}
            <NearbyStopsPanel 
              onToggle={(isExpanded) => {
                // Handle panel toggle
                console.log('Panel toggled:', isExpanded);
              }}
              onStopSelect={(stop) => {
                // Handle stop selection
                console.log('Stop selected:', stop);
              }}
            />

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {activeBuses?.filter(bus => bus?.status === 'active')?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Active Buses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {serviceAlerts?.filter(alert => alert?.alert_type === 'disruption')?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Service Alerts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PassengerDashboard;
