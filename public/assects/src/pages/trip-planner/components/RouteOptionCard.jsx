import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RouteOptionCard = ({ 
  route, 
  isExpanded = false, 
  onToggleExpand, 
  onSelectRoute, 
  onSaveRoute,
  isRecommended = false 
}) => {
  const [isSaved, setIsSaved] = useState(route?.isSaved || false);

  const handleSaveRoute = () => {
    setIsSaved(!isSaved);
    onSaveRoute?.(route?.id, !isSaved);
  };

  const getRouteTypeIcon = (type) => {
    switch (type) {
      case 'fastest': return 'Zap';
      case 'comfortable': return 'Armchair';
      case 'economical': return 'DollarSign';
      case 'direct': return 'ArrowRight';
      default: return 'Route';
    }
  };

  const getRouteTypeColor = (type) => {
    switch (type) {
      case 'fastest': return 'text-warning';
      case 'comfortable': return 'text-success';
      case 'economical': return 'text-primary';
      case 'direct': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`)?.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-card border rounded-lg transition-all duration-200 ${
      isRecommended ? 'border-primary shadow-nav-shadow' : 'border-border hover:shadow-nav-shadow'
    }`}>
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-t-lg">
          <Icon name="Star" size={12} className="inline mr-1" />
          Recommended Route
        </div>
      )}
      {/* Route Summary */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-muted ${getRouteTypeColor(route?.type)}`}>
              <Icon name={getRouteTypeIcon(route?.type)} size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground capitalize">
                {route?.type} Route
              </h3>
              <p className="text-sm text-muted-foreground">
                {route?.buses?.length} bus{route?.buses?.length > 1 ? 'es' : ''} • {route?.transfers} transfer{route?.transfers !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveRoute}
              className={isSaved ? 'text-warning' : 'text-muted-foreground'}
            >
              <Icon name={isSaved ? 'Heart' : 'Heart'} size={16} fill={isSaved ? 'currentColor' : 'none'} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
            >
              <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
            </Button>
          </div>
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {formatDuration(route?.totalDuration)}
            </div>
            <div className="text-xs text-muted-foreground">Total Time</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {route?.walkingDistance}m
            </div>
            <div className="text-xs text-muted-foreground">Walking</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              ₹{route?.estimatedCost}
            </div>
            <div className="text-xs text-muted-foreground">Est. Cost</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Icon name="Clock" size={14} className="text-success" />
              <span className="text-sm font-medium text-success">
                {route?.reliability}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground">On Time</div>
          </div>
        </div>

        {/* Quick Timeline */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} />
            <span>Depart: {formatTime(route?.departureTime)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={14} />
            <span>Arrive: {formatTime(route?.arrivalTime)}</span>
          </div>
        </div>

        {/* Live Status */}
        {route?.liveStatus && (
          <div className={`flex items-center space-x-2 text-xs p-2 rounded-md mb-4 ${
            route?.liveStatus?.type === 'delay' ? 'bg-warning/10 text-warning' :
            route?.liveStatus?.type === 'ontime'? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          }`}>
            <Icon 
              name={
                route?.liveStatus?.type === 'delay' ? 'Clock' :
                route?.liveStatus?.type === 'ontime'? 'CheckCircle' : 'AlertTriangle'
              } 
              size={14} 
            />
            <span>{route?.liveStatus?.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="default"
            size="sm"
            fullWidth
            onClick={() => onSelectRoute(route)}
            iconName="Navigation"
            iconPosition="left"
            iconSize={16}
          >
            Select Route
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleExpand}
            iconName="Info"
            iconSize={16}
          >
            Details
          </Button>
        </div>
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border p-4 space-y-4">
          <h4 className="font-medium text-foreground mb-3">Step-by-Step Directions</h4>
          
          {route?.steps?.map((step, index) => (
            <div key={index} className="flex space-x-3">
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full ${
                  step?.type === 'bus' ? 'bg-primary/10 text-primary' :
                  step?.type === 'walk' ? 'bg-muted text-muted-foreground' :
                  'bg-warning/10 text-warning'
                }`}>
                  <Icon 
                    name={
                      step?.type === 'bus' ? 'Bus' :
                      step?.type === 'walk'? 'Footprints' : 'ArrowRight'
                    } 
                    size={16} 
                  />
                </div>
                {index < route?.steps?.length - 1 && (
                  <div className="w-0.5 h-8 bg-border mt-2"></div>
                )}
              </div>
              
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium text-sm text-foreground">
                    {step?.type === 'bus' ? `Bus ${step?.busNumber}` : 
                     step?.type === 'walk' ? 'Walk' : 'Transfer'}
                  </h5>
                  <span className="text-xs text-muted-foreground">
                    {formatDuration(step?.duration)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {step?.description}
                </p>
                
                {step?.type === 'bus' && (
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{formatTime(step?.departureTime)} - {formatTime(step?.arrivalTime)}</span>
                    </div>
                    {step?.seatAvailability && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Users" size={12} />
                        <span>{step?.seatAvailability} seats</span>
                      </div>
                    )}
                  </div>
                )}
                
                {step?.type === 'walk' && (
                  <div className="text-xs text-muted-foreground">
                    <Icon name="Navigation" size={12} className="inline mr-1" />
                    {step?.distance}m • {step?.duration} min walk
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Additional Options */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              iconName="Share"
              iconPosition="left"
              iconSize={14}
            >
              Share Route
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Bell"
              iconPosition="left"
              iconSize={14}
            >
              Set Reminder
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              iconPosition="left"
              iconSize={14}
            >
              Offline Map
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteOptionCard;
