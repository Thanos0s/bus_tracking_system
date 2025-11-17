import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RealTimeArrivals = ({ stopId, onSetAlert, onViewRoute }) => {
  const [arrivals, setArrivals] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Mock real-time arrivals data
  const mockArrivals = [
    {
      id: 'arr_001',
      routeNumber: '15A',
      routeColor: '#2563eb',
      destination: 'City Center',
      currentLocation: 'Approaching Mall Road',
      eta: 3,
      delay: 0,
      accuracy: 'high',
      busId: 'PB-02-1234',
      seatAvailability: 'medium',
      occupancyLevel: 65,
      isLowFloor: true,
      hasAC: true,
      nextStops: ['Mall Road', 'Central Plaza', 'City Center']
    },
    {
      id: 'arr_002',
      routeNumber: '22B',
      routeColor: '#dc2626',
      destination: 'Railway Station',
      currentLocation: 'Traffic Signal - Phase 7',
      eta: 7,
      delay: 2,
      accuracy: 'medium',
      busId: 'PB-02-5678',
      seatAvailability: 'high',
      occupancyLevel: 30,
      isLowFloor: false,
      hasAC: false,
      nextStops: ['Phase 7', 'Industrial Area', 'Railway Station']
    },
    {
      id: 'arr_003',
      routeNumber: '8C',
      routeColor: '#16a34a',
      destination: 'University Campus',
      currentLocation: 'Sector 35 Bus Stand',
      eta: 12,
      delay: -1,
      accuracy: 'high',
      busId: 'PB-02-9012',
      seatAvailability: 'low',
      occupancyLevel: 85,
      isLowFloor: true,
      hasAC: true,
      nextStops: ['Sector 35', 'Sector 36', 'University Campus']
    },
    {
      id: 'arr_004',
      routeNumber: '45D',
      routeColor: '#f59e0b',
      destination: 'Airport Terminal',
      currentLocation: 'Starting from Depot',
      eta: 18,
      delay: 0,
      accuracy: 'low',
      busId: 'PB-02-3456',
      seatAvailability: 'high',
      occupancyLevel: 15,
      isLowFloor: true,
      hasAC: true,
      nextStops: ['Depot', 'Highway Junction', 'Airport Terminal']
    }
  ];

  useEffect(() => {
    // Simulate real-time data updates
    const updateArrivals = () => {
      setArrivals(mockArrivals);
      setLastUpdate(new Date());
      setIsLoading(false);
    };

    updateArrivals();
    const interval = setInterval(updateArrivals, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [stopId]);

  const getETAColor = (eta, delay) => {
    if (eta <= 2) return 'text-success';
    if (eta <= 5) return 'text-warning';
    if (delay > 3) return 'text-error';
    return 'text-foreground';
  };

  const getAccuracyIcon = (accuracy) => {
    switch (accuracy) {
      case 'high': return { icon: 'Target', color: 'text-success' };
      case 'medium': return { icon: 'Circle', color: 'text-warning' };
      case 'low': return { icon: 'HelpCircle', color: 'text-muted-foreground' };
      default: return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getSeatAvailabilityConfig = (availability, occupancy) => {
    if (availability === 'high' || occupancy < 40) {
      return { color: 'text-success', bg: 'bg-success/10', label: 'Seats Available' };
    } else if (availability === 'medium' || occupancy < 70) {
      return { color: 'text-warning', bg: 'bg-warning/10', label: 'Limited Seats' };
    } else {
      return { color: 'text-error', bg: 'bg-error/10', label: 'Nearly Full' };
    }
  };

  const formatETA = (eta, delay) => {
    if (eta <= 1) return 'Arriving';
    const actualETA = eta + (delay > 0 ? delay : 0);
    return `${actualETA} min`;
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-center h-32">
          <Icon name="Loader" size={24} className="animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Clock" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Live Arrivals</h2>
            <div className="status-dot bg-success pulse-status"></div>
          </div>
          <div className="text-xs text-muted-foreground">
            Updated {lastUpdate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      {/* Arrivals List */}
      <div className="divide-y divide-border">
        {arrivals?.map((arrival) => {
          const seatConfig = getSeatAvailabilityConfig(arrival?.seatAvailability, arrival?.occupancyLevel);
          const accuracyConfig = getAccuracyIcon(arrival?.accuracy);
          
          return (
            <div key={arrival?.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                {/* Route Info */}
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-8 rounded flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: arrival?.routeColor }}
                  >
                    {arrival?.routeNumber}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{arrival?.destination}</div>
                    <div className="text-sm text-muted-foreground">{arrival?.currentLocation}</div>
                  </div>
                </div>

                {/* ETA */}
                <div className="text-right">
                  <div className={`text-xl font-bold ${getETAColor(arrival?.eta, arrival?.delay)}`}>
                    {formatETA(arrival?.eta, arrival?.delay)}
                  </div>
                  {arrival?.delay !== 0 && (
                    <div className={`text-xs ${arrival?.delay > 0 ? 'text-error' : 'text-success'}`}>
                      {arrival?.delay > 0 ? `+${arrival?.delay}` : arrival?.delay} min
                    </div>
                  )}
                </div>
              </div>
              {/* Bus Details */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  {/* Bus Features */}
                  <div className="flex items-center space-x-2">
                    {arrival?.isLowFloor && (
                      <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                        <Icon name="Accessibility" size={12} />
                        <span>Low Floor</span>
                      </div>
                    )}
                    {arrival?.hasAC && (
                      <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                        <Icon name="Snowflake" size={12} />
                        <span>AC</span>
                      </div>
                    )}
                  </div>

                  {/* Accuracy Indicator */}
                  <div className="flex items-center space-x-1">
                    <Icon name={accuracyConfig?.icon} size={12} className={accuracyConfig?.color} />
                    <span className="text-xs text-muted-foreground capitalize">{arrival?.accuracy}</span>
                  </div>
                </div>

                {/* Seat Availability */}
                <div className={`flex items-center space-x-2 ${seatConfig?.bg} px-3 py-1 rounded-full`}>
                  <Icon name="Users" size={12} className={seatConfig?.color} />
                  <span className={`text-xs font-medium ${seatConfig?.color}`}>
                    {seatConfig?.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({arrival?.occupancyLevel}%)
                  </span>
                </div>
              </div>
              {/* Next Stops */}
              <div className="mb-3">
                <div className="text-xs text-muted-foreground mb-1">Next stops:</div>
                <div className="flex items-center space-x-2 text-xs">
                  {arrival?.nextStops?.slice(0, 3)?.map((stop, index) => (
                    <React.Fragment key={stop}>
                      <span className="text-foreground">{stop}</span>
                      {index < arrival?.nextStops?.slice(0, 3)?.length - 1 && (
                        <Icon name="ChevronRight" size={10} className="text-muted-foreground" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSetAlert(arrival)}
                  iconName="Bell"
                  iconPosition="left"
                  iconSize={14}
                >
                  Alert Me
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewRoute(arrival?.routeNumber)}
                  iconName="Route"
                  iconPosition="left"
                  iconSize={14}
                >
                  View Route
                </Button>

                <div className="text-xs text-muted-foreground ml-auto">
                  Bus #{arrival?.busId}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* No Arrivals State */}
      {arrivals?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Upcoming Arrivals</h3>
          <p className="text-muted-foreground">
            No buses are currently scheduled to arrive at this stop in the next 30 minutes.
          </p>
        </div>
      )}
    </div>
  );
};

export default RealTimeArrivals;