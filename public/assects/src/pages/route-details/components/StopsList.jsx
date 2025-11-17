import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StopsList = ({ 
  route, 
  buses, 
  selectedStop, 
  onStopSelect,
  onNotificationSet,
  className = '' 
}) => {
  const [expandedStop, setExpandedStop] = useState(null);
  const [notificationStops, setNotificationStops] = useState(new Set());

  const calculateETA = (stop, buses) => {
    const nearestBus = buses?.filter(bus => bus?.nextStopId === stop?.id || bus?.currentStopIndex <= stop?.sequence)?.sort((a, b) => a?.distanceToStop - b?.distanceToStop)?.[0];

    if (!nearestBus) return { eta: 'No buses', status: 'unavailable' };

    const eta = Math.max(1, Math.round(nearestBus?.distanceToStop / 0.5)); // Assuming 0.5km/min average speed
    
    if (eta <= 2) return { eta: `${eta} min`, status: 'arriving' };
    if (eta <= 5) return { eta: `${eta} min`, status: 'nearby' };
    return { eta: `${eta} min`, status: 'normal' };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'arriving': return 'text-success';
      case 'nearby': return 'text-warning';
      case 'unavailable': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'arriving': return 'bg-success/10 border-success/20';
      case 'nearby': return 'bg-warning/10 border-warning/20';
      case 'unavailable': return 'bg-muted/10 border-border';
      default: return 'bg-card border-border';
    }
  };

  const handleNotificationToggle = (stop) => {
    const newNotifications = new Set(notificationStops);
    if (newNotifications?.has(stop?.id)) {
      newNotifications?.delete(stop?.id);
    } else {
      newNotifications?.add(stop?.id);
    }
    setNotificationStops(newNotifications);
    onNotificationSet?.(stop, !notificationStops?.has(stop?.id));
  };

  const handleStopClick = (stop) => {
    onStopSelect(stop);
    setExpandedStop(expandedStop === stop?.id ? null : stop?.id);
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-card-foreground">Route Stops</h3>
            <p className="text-sm text-muted-foreground">
              {route?.stops?.length} stops • Live ETAs
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Live Updates</span>
            </div>
          </div>
        </div>
      </div>
      {/* Stops List */}
      <div className="max-h-96 overflow-y-auto">
        {route?.stops?.map((stop, index) => {
          const etaInfo = calculateETA(stop, buses);
          const isExpanded = expandedStop === stop?.id;
          const isSelected = selectedStop?.id === stop?.id;
          const hasNotification = notificationStops?.has(stop?.id);

          return (
            <div
              key={stop?.id}
              className={`border-b border-border last:border-b-0 transition-all duration-200 ${
                isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'
              }`}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => handleStopClick(stop)}
              >
                <div className="flex items-center space-x-4">
                  {/* Stop Number */}
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'bg-card border-primary text-primary'
                  }`}>
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>

                  {/* Stop Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-card-foreground truncate">
                          {stop?.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {stop?.area} • Stop #{stop?.code}
                        </p>
                      </div>
                      
                      {/* ETA */}
                      <div className={`text-right ${getStatusColor(etaInfo?.status)}`}>
                        <div className="font-semibold text-sm">
                          {etaInfo?.eta}
                        </div>
                        <div className="text-xs capitalize">
                          {etaInfo?.status === 'unavailable' ? 'No buses' : etaInfo?.status}
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        {/* Facilities */}
                        {stop?.facilities?.includes('shelter') && (
                          <Icon name="Home" size={14} className="text-muted-foreground" title="Shelter available" />
                        )}
                        {stop?.facilities?.includes('seating') && (
                          <Icon name="Armchair" size={14} className="text-muted-foreground" title="Seating available" />
                        )}
                        {stop?.facilities?.includes('digital_display') && (
                          <Icon name="Monitor" size={14} className="text-muted-foreground" title="Digital display" />
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Notification Toggle */}
                        <button
                          onClick={(e) => {
                            e?.stopPropagation();
                            handleNotificationToggle(stop);
                          }}
                          className={`p-1 rounded transition-colors ${
                            hasNotification 
                              ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                          title={hasNotification ? 'Disable notifications' : 'Enable notifications'}
                        >
                          <Icon name={hasNotification ? "BellRing" : "Bell"} size={14} />
                        </button>

                        {/* Expand Toggle */}
                        <Icon 
                          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                          size={16} 
                          className="text-muted-foreground" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border bg-muted/20">
                  <div className="pt-3 space-y-3">
                    {/* Approaching Buses */}
                    <div>
                      <h5 className="text-sm font-medium text-card-foreground mb-2">
                        Approaching Buses
                      </h5>
                      <div className="space-y-2">
                        {buses?.filter(bus => bus?.nextStopId === stop?.id || bus?.currentStopIndex <= stop?.sequence)?.slice(0, 3)?.map(bus => (
                            <div key={bus?.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  bus?.status === 'on_time' ? 'bg-success' : 
                                  bus?.status === 'delayed' ? 'bg-warning' : 'bg-error'
                                }`}></div>
                                <span className="text-card-foreground">Bus {bus?.number}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-muted-foreground">
                                <span>{Math.round(bus?.distanceToStop * 1000)}m away</span>
                                <div className="flex items-center space-x-1">
                                  <Icon name="Users" size={12} />
                                  <span>{bus?.occupancy}%</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Stop Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Coordinates:</span>
                        <div className="font-mono text-xs text-card-foreground">
                          {stop?.latitude?.toFixed(4)}, {stop?.longitude?.toFixed(4)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Update:</span>
                        <div className="text-card-foreground">
                          {new Date()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Navigation"
                        iconPosition="left"
                        iconSize={14}
                      >
                        Directions
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Flag"
                        iconPosition="left"
                        iconSize={14}
                      >
                        Report Issue
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last updated: {new Date()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex items-center space-x-1">
            <Icon name="RefreshCw" size={12} className="animate-spin" />
            <span>Auto-refresh</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StopsList;