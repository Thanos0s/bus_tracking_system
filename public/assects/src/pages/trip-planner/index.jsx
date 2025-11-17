import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import JourneyPlanningForm from './components/JourneyPlanningForm';
import RouteOptionCard from './components/RouteOptionCard';
import RouteComparison from './components/RouteComparison';
import SavedTripsPanel from './components/SavedTripsPanel';
import QuickActionsPanel from './components/QuickActionsPanel';

const TripPlanner = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [expandedRouteId, setExpandedRouteId] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showSavedTrips, setShowSavedTrips] = useState(false);
  const [lastSearchParams, setLastSearchParams] = useState(null);

  // Mock route data
  const mockRoutes = [
    {
      id: 1,
      type: 'fastest',
      totalDuration: 35,
      estimatedCost: 25,
      transfers: 1,
      walkingDistance: 450,
      reliability: 92,
      departureTime: '08:30:00',
      arrivalTime: '09:05:00',
      origin: 'Central Bus Station',
      destination: 'Business District',
      liveStatus: {
        type: 'ontime',
        message: 'All buses running on schedule'
      },
      buses: ['Route 15', 'Route 8'],
      comfortScore: 85,
      isSaved: false,
      pros: ['Fastest option', 'High reliability', 'Good bus frequency'],
      cons: ['One transfer required'],
      steps: [
        {
          type: 'walk',
          description: 'Walk to Central Bus Station',
          duration: 5,
          distance: 350,
          departureTime: '08:25:00',
          arrivalTime: '08:30:00'
        },
        {
          type: 'bus',
          busNumber: 'Route 15',
          description: 'Take Route 15 towards City Center',
          duration: 18,
          departureTime: '08:30:00',
          arrivalTime: '08:48:00',
          seatAvailability: 'Available'
        },
        {
          type: 'transfer',
          description: 'Transfer at City Center Hub',
          duration: 3,
          departureTime: '08:48:00',
          arrivalTime: '08:51:00'
        },
        {
          type: 'bus',
          busNumber: 'Route 8',
          description: 'Take Route 8 to Business District',
          duration: 12,
          departureTime: '08:51:00',
          arrivalTime: '09:03:00',
          seatAvailability: 'Limited'
        },
        {
          type: 'walk',
          description: 'Walk to destination',
          duration: 2,
          distance: 100,
          departureTime: '09:03:00',
          arrivalTime: '09:05:00'
        }
      ]
    },
    {
      id: 2,
      type: 'comfortable',
      totalDuration: 42,
      estimatedCost: 30,
      transfers: 0,
      walkingDistance: 200,
      reliability: 88,
      departureTime: '08:25:00',
      arrivalTime: '09:07:00',
      origin: 'Central Bus Station',
      destination: 'Business District',
      liveStatus: {
        type: 'delay',
        message: '3 minute delay due to traffic'
      },
      buses: ['Express 12'],
      comfortScore: 95,
      isSaved: true,
      pros: ['Direct route', 'Most comfortable', 'Air conditioned'],
      cons: ['Slightly longer', 'Higher cost'],
      steps: [
        {
          type: 'walk',
          description: 'Walk to Express Bus Stop',
          duration: 3,
          distance: 150,
          departureTime: '08:22:00',
          arrivalTime: '08:25:00'
        },
        {
          type: 'bus',
          busNumber: 'Express 12',
          description: 'Take Express 12 direct to Business District',
          duration: 37,
          departureTime: '08:25:00',
          arrivalTime: '09:02:00',
          seatAvailability: 'Available'
        },
        {
          type: 'walk',
          description: 'Walk to destination',
          duration: 2,
          distance: 50,
          departureTime: '09:02:00',
          arrivalTime: '09:04:00'
        }
      ]
    },
    {
      id: 3,
      type: 'economical',
      totalDuration: 48,
      estimatedCost: 18,
      transfers: 2,
      walkingDistance: 650,
      reliability: 78,
      departureTime: '08:20:00',
      arrivalTime: '09:08:00',
      origin: 'Central Bus Station',
      destination: 'Business District',
      liveStatus: {
        type: 'ontime',
        message: 'Running on schedule'
      },
      buses: ['Route 3', 'Route 7', 'Route 11'],
      comfortScore: 70,
      isSaved: false,
      pros: ['Lowest cost', 'Good coverage'],
      cons: ['Multiple transfers', 'Longer walking distance'],
      steps: [
        {
          type: 'walk',
          description: 'Walk to Local Bus Stop',
          duration: 8,
          distance: 500,
          departureTime: '08:12:00',
          arrivalTime: '08:20:00'
        },
        {
          type: 'bus',
          busNumber: 'Route 3',
          description: 'Take Route 3 to Market Square',
          duration: 15,
          departureTime: '08:20:00',
          arrivalTime: '08:35:00',
          seatAvailability: 'Available'
        },
        {
          type: 'transfer',
          description: 'Transfer at Market Square',
          duration: 5,
          departureTime: '08:35:00',
          arrivalTime: '08:40:00'
        },
        {
          type: 'bus',
          busNumber: 'Route 7',
          description: 'Take Route 7 to Central Hub',
          duration: 12,
          departureTime: '08:40:00',
          arrivalTime: '08:52:00',
          seatAvailability: 'Available'
        },
        {
          type: 'transfer',
          description: 'Transfer at Central Hub',
          duration: 4,
          departureTime: '08:52:00',
          arrivalTime: '08:56:00'
        },
        {
          type: 'bus',
          busNumber: 'Route 11',
          description: 'Take Route 11 to Business District',
          duration: 10,
          departureTime: '08:56:00',
          arrivalTime: '09:06:00',
          seatAvailability: 'Limited'
        },
        {
          type: 'walk',
          description: 'Walk to destination',
          duration: 2,
          distance: 150,
          departureTime: '09:06:00',
          arrivalTime: '09:08:00'
        }
      ]
    }
  ];

  useEffect(() => {
    // Check for URL parameters to pre-fill form
    const from = searchParams?.get('from');
    const to = searchParams?.get('to');
    
    if (from && to && (!lastSearchParams || lastSearchParams?.from !== from || lastSearchParams?.to !== to)) {
      setLastSearchParams({ from, to });
      // Simulate route search with URL parameters
      handlePlanJourney({
        origin: from,
        destination: to,
        departureType: 'now',
        preferences: { fastest: true }
      });
    }
  }, [searchParams, lastSearchParams]);

  const handlePlanJourney = async (formData) => {
    setIsLoading(true);
    setRoutes([]);
    setSelectedRoute(null);
    
    // Simulate API call
    setTimeout(() => {
      // Update mock routes with form data
      const updatedRoutes = mockRoutes?.map(route => ({
        ...route,
        origin: formData?.origin,
        destination: formData?.destination
      }));
      
      setRoutes(updatedRoutes);
      setIsLoading(false);
      
      // Auto-select recommended route (fastest with good reliability)
      const recommendedRoute = updatedRoutes?.find(r => r?.type === 'fastest');
      if (recommendedRoute) {
        setSelectedRoute(recommendedRoute);
      }
    }, 2000);
  };

  const handleToggleExpand = (routeId) => {
    setExpandedRouteId(expandedRouteId === routeId ? null : routeId);
  };

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    setShowComparison(false);
  };

  const handleSaveRoute = (routeId, isSaved) => {
    setRoutes(routes?.map(route => 
      route?.id === routeId ? { ...route, isSaved } : route
    ));
  };

  const handleSelectSavedTrip = (trip) => {
    // Pre-fill form with saved trip data
    handlePlanJourney({
      origin: trip?.origin,
      destination: trip?.destination,
      departureType: 'now',
      preferences: { fastest: true }
    });
    setShowSavedTrips(false);
  };

  const handleDeleteSavedTrip = (tripId) => {
    // Handle trip deletion
    console.log('Delete trip:', tripId);
  };

  const handleStartNavigation = () => {
    if (selectedRoute) {
      // Navigate to a navigation page or open maps
      navigate('/passenger-dashboard', { 
        state: { 
          activeRoute: selectedRoute,
          navigationMode: true 
        } 
      });
    }
  };

  const handleSetReminder = (isSet) => {
    console.log('Reminder set:', isSet);
  };

  const handleShareRoute = () => {
    console.log('Share route:', selectedRoute);
  };

  const handleSaveSelectedRoute = (isSaved) => {
    if (selectedRoute) {
      handleSaveRoute(selectedRoute?.id, isSaved);
    }
  };

  const handleDownloadOfflineMap = () => {
    console.log('Download offline map for route:', selectedRoute);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Trip Planner</h1>
              <p className="text-muted-foreground mt-2">
                Plan your journey with real-time route options and live updates
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowSavedTrips(true)}
                iconName="Bookmark"
                iconPosition="left"
                iconSize={16}
              >
                Saved Trips
              </Button>
              
              {routes?.length > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setShowComparison(true)}
                  iconName="BarChart3"
                  iconPosition="left"
                  iconSize={16}
                >
                  Compare Routes
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Planning Form */}
          <div className="lg:col-span-1">
            <JourneyPlanningForm 
              onPlanJourney={handlePlanJourney}
              isLoading={isLoading}
            />
            
            {/* Quick Actions Panel */}
            {selectedRoute && (
              <div className="mt-6">
                <QuickActionsPanel
                  selectedRoute={selectedRoute}
                  onSetReminder={handleSetReminder}
                  onShareRoute={handleShareRoute}
                  onSaveRoute={handleSaveSelectedRoute}
                  onStartNavigation={handleStartNavigation}
                  onDownloadOfflineMap={handleDownloadOfflineMap}
                />
              </div>
            )}
          </div>

          {/* Right Column - Route Results */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <Icon name="Loader" size={48} className="text-primary mx-auto mb-4 animate-spin" />
                <h3 className="font-medium text-foreground mb-2">Finding Best Routes</h3>
                <p className="text-sm text-muted-foreground">
                  Analyzing real-time data and traffic conditions...
                </p>
              </div>
            ) : routes?.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <Icon name="Route" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">Plan Your Journey</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your origin and destination to see available route options
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Route Options ({routes?.length})
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Choose the best route for your journey
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Icon name="Radio" size={14} className="text-success" />
                    <span>Live updates active</span>
                  </div>
                </div>

                {/* Route Cards */}
                <div className="space-y-4">
                  {routes?.map((route, index) => (
                    <RouteOptionCard
                      key={route?.id}
                      route={route}
                      isExpanded={expandedRouteId === route?.id}
                      onToggleExpand={() => handleToggleExpand(route?.id)}
                      onSelectRoute={handleSelectRoute}
                      onSaveRoute={handleSaveRoute}
                      isRecommended={index === 0}
                    />
                  ))}
                </div>

                {/* Additional Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComparison(true)}
                    iconName="BarChart3"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Compare All Routes
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="RefreshCw"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Refresh Routes
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Filter"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Filter Options
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modals */}
      {showComparison && (
        <RouteComparison
          routes={routes}
          onSelectRoute={handleSelectRoute}
          onClose={() => setShowComparison(false)}
        />
      )}
      {showSavedTrips && (
        <SavedTripsPanel
          onSelectTrip={handleSelectSavedTrip}
          onDeleteTrip={handleDeleteSavedTrip}
          isVisible={showSavedTrips}
          onClose={() => setShowSavedTrips(false)}
        />
      )}
    </div>
  );
};

export default TripPlanner;