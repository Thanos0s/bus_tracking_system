import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlternativeRoutes = ({ 
  currentRoute, 
  alternativeRoutes, 
  onRouteSelect,
  className = '' 
}) => {
  const [expandedRoute, setExpandedRoute] = useState(null);
  const [sortBy, setSortBy] = useState('time'); // time, distance, cost

  const getSortedRoutes = () => {
    return [...alternativeRoutes]?.sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return a?.estimatedTime - b?.estimatedTime;
        case 'distance':
          return a?.totalDistance - b?.totalDistance;
        case 'cost':
          return a?.totalFare - b?.totalFare;
        default:
          return 0;
      }
    });
  };

  const getRouteTypeIcon = (type) => {
    switch (type) {
      case 'direct': return 'ArrowRight';
      case 'transfer': return 'Shuffle';
      case 'express': return 'Zap';
      case 'circular': return 'RotateCcw';
      default: return 'Route';
    }
  };

  const getRouteTypeColor = (type) => {
    switch (type) {
      case 'direct': return 'text-success';
      case 'transfer': return 'text-warning';
      case 'express': return 'text-primary';
      case 'circular': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleRouteToggle = (routeId) => {
    setExpandedRoute(expandedRoute === routeId ? null : routeId);
  };

  const sortedRoutes = getSortedRoutes();

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-card-foreground">Alternative Routes</h3>
            <p className="text-sm text-muted-foreground">
              {alternativeRoutes?.length} alternative options available
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="text-sm bg-background border border-border rounded px-2 py-1 text-foreground"
            >
              <option value="time">Travel Time</option>
              <option value="distance">Distance</option>
              <option value="cost">Cost</option>
            </select>
          </div>
        </div>

        {/* Current Route Summary */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{currentRoute?.number}</span>
              </div>
              <div>
                <div className="font-medium text-card-foreground">Current Route</div>
                <div className="text-sm text-muted-foreground">{currentRoute?.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-primary">{formatTime(currentRoute?.estimatedTime)}</div>
              <div className="text-sm text-muted-foreground">₹{currentRoute?.fare}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Alternative Routes List */}
      <div className="max-h-96 overflow-y-auto">
        {sortedRoutes?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Route" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No alternative routes available</p>
          </div>
        ) : (
          sortedRoutes?.map((route) => {
            const isExpanded = expandedRoute === route?.id;
            const typeIcon = getRouteTypeIcon(route?.type);
            const typeColor = getRouteTypeColor(route?.type);

            return (
              <div
                key={route?.id}
                className="border-b border-border last:border-b-0 transition-all duration-200"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRouteToggle(route?.id)}
                >
                  <div className="flex items-center space-x-4">
                    {/* Route Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Icon name={typeIcon} size={20} className={typeColor} />
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-card-foreground">
                            {route?.routes?.map(r => r?.number)?.join(' → ')}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full bg-muted ${typeColor} capitalize`}>
                            {route?.type}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-card-foreground">
                            {formatTime(route?.estimatedTime)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ₹{route?.totalFare}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Icon name="MapPin" size={14} />
                            <span>{route?.totalDistance}km</span>
                          </div>
                          {route?.transfers > 0 && (
                            <div className="flex items-center space-x-1">
                              <Icon name="Shuffle" size={14} />
                              <span>{route?.transfers} transfer{route?.transfers > 1 ? 's' : ''}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Icon name="Clock" size={14} />
                            <span>Next: {route?.nextDeparture}</span>
                          </div>
                        </div>
                        
                        <Icon 
                          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                          size={16} 
                          className="text-muted-foreground" 
                        />
                      </div>

                      {/* Comparison Indicators */}
                      <div className="flex items-center space-x-4 mt-2">
                        {route?.estimatedTime < currentRoute?.estimatedTime && (
                          <div className="flex items-center space-x-1 text-success text-xs">
                            <Icon name="TrendingDown" size={12} />
                            <span>{currentRoute?.estimatedTime - route?.estimatedTime}m faster</span>
                          </div>
                        )}
                        {route?.totalFare < currentRoute?.fare && (
                          <div className="flex items-center space-x-1 text-success text-xs">
                            <Icon name="DollarSign" size={12} />
                            <span>₹{currentRoute?.fare - route?.totalFare} cheaper</span>
                          </div>
                        )}
                        {route?.estimatedTime > currentRoute?.estimatedTime && (
                          <div className="flex items-center space-x-1 text-warning text-xs">
                            <Icon name="TrendingUp" size={12} />
                            <span>{route?.estimatedTime - currentRoute?.estimatedTime}m longer</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border bg-muted/20">
                    <div className="pt-4 space-y-4">
                      {/* Route Steps */}
                      <div>
                        <h5 className="text-sm font-medium text-card-foreground mb-3">Route Details</h5>
                        <div className="space-y-3">
                          {route?.routes?.map((routeStep, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">{routeStep?.number}</span>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-card-foreground">
                                  {routeStep?.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {routeStep?.from} → {routeStep?.to}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatTime(routeStep?.duration)} • ₹{routeStep?.fare}
                                </div>
                              </div>
                              {index < route?.routes?.length - 1 && (
                                <div className="text-muted-foreground">
                                  <Icon name="ArrowDown" size={14} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Transfer Information */}
                      {route?.transfers > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-card-foreground mb-2">Transfer Points</h5>
                          <div className="space-y-2">
                            {route?.transferPoints?.map((transfer, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <Icon name="Shuffle" size={14} className="text-warning" />
                                  <span className="text-card-foreground">{transfer?.location}</span>
                                </div>
                                <div className="text-muted-foreground">
                                  {transfer?.walkingTime}m walk
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 pt-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onRouteSelect(route)}
                          iconName="Navigation"
                          iconPosition="left"
                          iconSize={14}
                        >
                          Select Route
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="Eye"
                          iconPosition="left"
                          iconSize={14}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Share2"
                          iconPosition="left"
                          iconSize={14}
                        >
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Routes updated: {new Date()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Direct</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>Transfer</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Express</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativeRoutes;