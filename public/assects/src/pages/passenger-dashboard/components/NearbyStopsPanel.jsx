import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NearbyStopsPanel = ({ 
  isCollapsed = false, 
  onToggle, 
  userLocation = null,
  onStopSelect 
}) => {
  const [selectedStop, setSelectedStop] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock nearby stops with live data
  const [nearbyStops, setNearbyStops] = useState([
    {
      id: 'STOP001',
      name: 'Sector 17 Plaza',
      distance: 150,
      walkTime: 2,
      routes: [
        {
          number: '42A',
          destination: 'Railway Station',
          arrivals: [
            { busId: 'BUS001', eta: 3, status: 'on_time', occupancy: 62 },
            { busId: 'BUS004', eta: 18, status: 'on_time', occupancy: 45 }
          ]
        },
        {
          number: '15B',
          destination: 'PGI Hospital',
          arrivals: [
            { busId: 'BUS002', eta: 7, status: 'delayed', occupancy: 88 },
            { busId: 'BUS005', eta: 22, status: 'on_time', occupancy: 30 }
          ]
        }
      ],
      amenities: ['shelter', 'seating', 'display', 'lighting'],
      accessibility: true
    },
    {
      id: 'STOP002',
      name: 'PGI Hospital Main Gate',
      distance: 280,
      walkTime: 4,
      routes: [
        {
          number: '15B',
          destination: 'Sector 43',
          arrivals: [
            { busId: 'BUS006', eta: 5, status: 'early', occupancy: 25 },
            { busId: 'BUS007', eta: 20, status: 'on_time', occupancy: 55 }
          ]
        },
        {
          number: '22D',
          destination: 'Industrial Area',
          arrivals: [
            { busId: 'BUS008', eta: 12, status: 'on_time', occupancy: 70 }
          ]
        }
      ],
      amenities: ['shelter', 'display'],
      accessibility: true
    },
    {
      id: 'STOP003',
      name: 'Sector 22 Market',
      distance: 420,
      walkTime: 6,
      routes: [
        {
          number: '8C',
          destination: 'University',
          arrivals: [
            { busId: 'BUS009', eta: 8, status: 'on_time', occupancy: 40 },
            { busId: 'BUS010', eta: 25, status: 'on_time', occupancy: 60 }
          ]
        }
      ],
      amenities: ['shelter', 'seating'],
      accessibility: false
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNearbyStops(prevStops => 
        prevStops?.map(stop => ({
          ...stop,
          routes: stop?.routes?.map(route => ({
            ...route,
            arrivals: route?.arrivals?.map(arrival => ({
              ...arrival,
              eta: Math.max(1, arrival?.eta - 1),
              occupancy: Math.max(0, Math.min(100, arrival?.occupancy + Math.floor((Math.random() - 0.5) * 10)))
            }))
          }))
        }))
      );
      setLastUpdate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
    setLastUpdate(new Date());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on_time': return 'text-success';
      case 'delayed': return 'text-error';
      case 'early': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getOccupancyColor = (occupancy) => {
    if (occupancy < 50) return 'text-success';
    if (occupancy < 80) return 'text-warning';
    return 'text-error';
  };

  const getOccupancyIcon = (occupancy) => {
    if (occupancy < 50) return 'Users';
    if (occupancy < 80) return 'UserCheck';
    return 'UserX';
  };

  return (
    <div className={`bg-card border border-border rounded-lg transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-full lg:w-80'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex-1">
            <h2 className="font-semibold text-card-foreground">Nearby Stops</h2>
            <p className="text-xs text-muted-foreground">
              Updated {lastUpdate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="touch-target"
            >
              <Icon 
                name="RefreshCw" 
                size={16} 
                className={refreshing ? 'animate-spin' : ''} 
              />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="touch-target"
          >
            <Icon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={16} 
            />
          </Button>
        </div>
      </div>
      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-4 max-h-96 lg:max-h-[500px] overflow-y-auto">
          {nearbyStops?.map(stop => (
            <div
              key={stop?.id}
              className={`border border-border rounded-lg p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedStop?.id === stop?.id ? 'bg-muted border-primary' : ''
              }`}
              onClick={() => {
                setSelectedStop(stop);
                onStopSelect?.(stop);
              }}
            >
              {/* Stop Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-card-foreground">{stop?.name}</h3>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={12} />
                      <span>{stop?.distance}m away</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{stop?.walkTime} min walk</span>
                    </div>
                    {stop?.accessibility && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Accessibility" size={12} className="text-success" />
                        <span>Accessible</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex items-center space-x-2 mb-3">
                {stop?.amenities?.map(amenity => (
                  <div
                    key={amenity}
                    className="flex items-center space-x-1 bg-muted rounded-full px-2 py-1 text-xs"
                  >
                    <Icon 
                      name={
                        amenity === 'shelter' ? 'Home' :
                        amenity === 'seating' ? 'Armchair' :
                        amenity === 'display' ? 'Monitor' :
                        amenity === 'lighting' ? 'Lightbulb' :
                        amenity === 'restroom' ? 'Bath' : 'Check'
                      } 
                      size={10} 
                    />
                    <span className="capitalize">{amenity}</span>
                  </div>
                ))}
              </div>

              {/* Routes and Arrivals */}
              <div className="space-y-3">
                {stop?.routes?.map(route => (
                  <div key={route?.number} className="border-l-2 border-primary pl-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium text-primary">Route {route?.number}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          → {route?.destination}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {route?.arrivals?.map((arrival, index) => (
                        <div key={arrival?.busId} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                              {arrival?.busId}
                            </span>
                            <span className={getStatusColor(arrival?.status)}>
                              {arrival?.eta} min
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Icon 
                              name={getOccupancyIcon(arrival?.occupancy)} 
                              size={14} 
                              className={getOccupancyColor(arrival?.occupancy)} 
                            />
                            <span className={`text-xs ${getOccupancyColor(arrival?.occupancy)}`}>
                              {arrival?.occupancy}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* No Location Message */}
          {!userLocation && (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="MapPinOff" size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">Enable location access to see nearby stops</p>
            </div>
          )}
        </div>
      )}
      {/* Collapsed State */}
      {isCollapsed && (
        <div className="p-2 flex flex-col items-center space-y-2">
          <Icon name="MapPin" size={20} className="text-primary" />
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default NearbyStopsPanel;