import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LiveBusTracker = ({ 
  route, 
  buses, 
  onBusSelect,
  selectedBus,
  className = '' 
}) => {
  const [sortBy, setSortBy] = useState('eta'); // eta, occupancy, distance
  const [filterStatus, setFilterStatus] = useState('all'); // all, on_time, delayed, breakdown
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate real-time updates would happen here
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getFilteredAndSortedBuses = () => {
    let filteredBuses = buses;

    // Apply status filter
    if (filterStatus !== 'all') {
      filteredBuses = buses?.filter(bus => bus?.status === filterStatus);
    }

    // Apply sorting
    return filteredBuses?.sort((a, b) => {
      switch (sortBy) {
        case 'eta':
          return a?.eta - b?.eta;
        case 'occupancy':
          return a?.occupancy - b?.occupancy;
        case 'distance':
          return a?.distanceToStop - b?.distanceToStop;
        default:
          return 0;
      }
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'on_time':
        return { color: 'text-success', bg: 'bg-success', label: 'On Time' };
      case 'delayed':
        return { color: 'text-warning', bg: 'bg-warning', label: 'Delayed' };
      case 'breakdown':
        return { color: 'text-error', bg: 'bg-error', label: 'Breakdown' };
      default:
        return { color: 'text-muted-foreground', bg: 'bg-muted-foreground', label: 'Unknown' };
    }
  };

  const getOccupancyConfig = (occupancy) => {
    if (occupancy >= 90) return { color: 'text-error', label: 'Full', icon: 'UserX' };
    if (occupancy >= 70) return { color: 'text-warning', label: 'Crowded', icon: 'Users' };
    if (occupancy >= 40) return { color: 'text-primary', label: 'Moderate', icon: 'Users' };
    return { color: 'text-success', label: 'Available', icon: 'User' };
  };

  const formatETA = (eta) => {
    if (eta < 1) return 'Arriving';
    if (eta < 60) return `${Math.round(eta)} min`;
    return `${Math.round(eta / 60)}h ${Math.round(eta % 60)}m`;
  };

  const sortedBuses = getFilteredAndSortedBuses();

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-card-foreground">Live Bus Tracking</h3>
            <p className="text-sm text-muted-foreground">
              {sortedBuses?.length} buses on route • Real-time updates
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              iconName={autoRefresh ? "Pause" : "Play"}
              iconPosition="left"
              iconSize={14}
            >
              {autoRefresh ? "Pause" : "Resume"}
            </Button>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="text-sm bg-background border border-border rounded px-2 py-1 text-foreground"
            >
              <option value="eta">ETA</option>
              <option value="occupancy">Occupancy</option>
              <option value="distance">Distance</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e?.target?.value)}
              className="text-sm bg-background border border-border rounded px-2 py-1 text-foreground"
            >
              <option value="all">All Buses</option>
              <option value="on_time">On Time</option>
              <option value="delayed">Delayed</option>
              <option value="breakdown">Issues</option>
            </select>
          </div>
        </div>
      </div>
      {/* Bus List */}
      <div className="max-h-96 overflow-y-auto">
        {sortedBuses?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Bus" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No buses match the current filter</p>
          </div>
        ) : (
          sortedBuses?.map((bus) => {
            const statusConfig = getStatusConfig(bus?.status);
            const occupancyConfig = getOccupancyConfig(bus?.occupancy);
            const isSelected = selectedBus?.id === bus?.id;

            return (
              <div
                key={bus?.id}
                className={`border-b border-border last:border-b-0 p-4 cursor-pointer transition-all duration-200 ${
                  isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => onBusSelect(bus)}
              >
                <div className="flex items-center space-x-4">
                  {/* Bus Icon & Status */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-lg ${statusConfig?.bg} flex items-center justify-center`}>
                      <Icon name="Bus" size={20} className="text-white" />
                    </div>
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${statusConfig?.bg} border-2 border-card`}>
                      {bus?.status === 'delayed' && <Icon name="Clock" size={8} className="text-white" />}
                      {bus?.status === 'breakdown' && <Icon name="AlertTriangle" size={8} className="text-white" />}
                    </div>
                  </div>

                  {/* Bus Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-card-foreground">
                        Bus {bus?.number}
                      </h4>
                      <div className="text-right">
                        <div className="font-bold text-lg text-card-foreground">
                          {formatETA(bus?.eta)}
                        </div>
                        <div className={`text-xs ${statusConfig?.color}`}>
                          {statusConfig?.label}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4 text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Icon name="MapPin" size={14} />
                          <span>{bus?.currentLocation}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Navigation" size={14} />
                          <span>{(bus?.distanceToStop * 1000)?.toFixed(0)}m away</span>
                        </div>
                      </div>

                      {/* Occupancy */}
                      <div className={`flex items-center space-x-1 ${occupancyConfig?.color}`}>
                        <Icon name={occupancyConfig?.icon} size={14} />
                        <span className="font-medium">{bus?.occupancy}%</span>
                        <span className="text-xs">({occupancyConfig?.label})</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Route Progress</span>
                        <span>{Math.round((bus?.currentStopIndex / route?.stops?.length) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${statusConfig?.bg}`}
                          style={{ width: `${(bus?.currentStopIndex / route?.stops?.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Additional Info for Selected Bus */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-muted-foreground">Driver:</span>
                            <div className="font-medium text-card-foreground">{bus?.driver}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Speed:</span>
                            <div className="font-medium text-card-foreground">{bus?.speed} km/h</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Next Stop:</span>
                            <div className="font-medium text-card-foreground">{bus?.nextStop}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Update:</span>
                            <div className="font-medium text-card-foreground">
                              {new Date(bus.lastUpdate)?.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Last updated: {lastUpdate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {autoRefresh && (
              <div className="flex items-center space-x-1">
                <Icon name="RefreshCw" size={12} className="animate-spin" />
                <span>Auto-refresh enabled</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>On Time</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>Delayed</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-error rounded-full"></div>
              <span>Issues</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveBusTracker;