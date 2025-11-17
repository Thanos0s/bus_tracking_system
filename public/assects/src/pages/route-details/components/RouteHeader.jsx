import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RouteHeader = ({ 
  route, 
  onFavoriteToggle, 
  onShareRoute,
  onReportIssue,
  className = '' 
}) => {
  const [isFavorite, setIsFavorite] = useState(route?.isFavorite || false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleFavoriteToggle = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    onFavoriteToggle?.(route?.id, newFavoriteState);
  };

  const handleShare = (method) => {
    onShareRoute?.(route, method);
    setShowShareMenu(false);
  };

  const getOperationalStatus = () => {
    const currentTime = new Date();
    const currentHour = currentTime?.getHours();
    const [startHour] = route?.operatingHours?.start?.split(':')?.map(Number);
    const [endHour] = route?.operatingHours?.end?.split(':')?.map(Number);

    if (currentHour >= startHour && currentHour < endHour) {
      return { status: 'operational', label: 'Operational', color: 'text-success' };
    } else {
      return { status: 'closed', label: 'Service Closed', color: 'text-error' };
    }
  };

  const operationalStatus = getOperationalStatus();

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      {/* Route Title & Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{route?.number}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">{route?.name}</h1>
                <p className="text-sm text-muted-foreground">{route?.description}</p>
              </div>
            </div>
          </div>

          {/* Route Path */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
            <Icon name="MapPin" size={16} className="text-success" />
            <span className="font-medium">{route?.origin}</span>
            <Icon name="ArrowRight" size={14} />
            <Icon name="MapPin" size={16} className="text-error" />
            <span className="font-medium">{route?.destination}</span>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                operationalStatus?.status === 'operational' ? 'bg-success' : 'bg-error'
              } animate-pulse`}></div>
              <span className={operationalStatus?.color}>{operationalStatus?.label}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span>{route?.operatingHours?.start} - {route?.operatingHours?.end}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="Timer" size={14} />
              <span>Every {route?.frequency} min</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant={isFavorite ? "default" : "outline"}
            size="sm"
            onClick={handleFavoriteToggle}
            iconName={isFavorite ? "Heart" : "Heart"}
            iconPosition="left"
            iconSize={16}
            className={isFavorite ? "text-error" : ""}
          >
            {isFavorite ? "Saved" : "Save"}
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShareMenu(!showShareMenu)}
              iconName="Share2"
              iconPosition="left"
              iconSize={16}
            >
              Share
            </Button>

            {/* Share Menu */}
            {showShareMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-nav-strong z-50">
                <div className="py-1">
                  <button
                    onClick={() => handleShare('link')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                  >
                    <Icon name="Link" size={16} />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                  >
                    <Icon name="MessageCircle" size={16} />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleShare('sms')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                  >
                    <Icon name="MessageSquare" size={16} />
                    <span>SMS</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReportIssue}
            iconName="Flag"
            iconPosition="left"
            iconSize={16}
          >
            Report
          </Button>
        </div>
      </div>
      {/* Route Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-card-foreground">{route?.distance}km</div>
          <div className="text-xs text-muted-foreground">Total Distance</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-card-foreground">{route?.stops?.length}</div>
          <div className="text-xs text-muted-foreground">Bus Stops</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-card-foreground">{route?.averageTime}</div>
          <div className="text-xs text-muted-foreground">Avg Journey</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-card-foreground">₹{route?.fare}</div>
          <div className="text-xs text-muted-foreground">Base Fare</div>
        </div>
      </div>
      {/* Service Alerts */}
      {route?.alerts && route?.alerts?.length > 0 && (
        <div className="mt-4 space-y-2">
          {route?.alerts?.map((alert, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 p-3 rounded-lg border ${
                alert?.type === 'warning' ?'bg-warning/10 border-warning/20 text-warning-foreground' 
                  : alert?.type === 'error' ?'bg-error/10 border-error/20 text-error-foreground' :'bg-primary/10 border-primary/20 text-primary-foreground'
              }`}
            >
              <Icon 
                name={alert?.type === 'warning' ? "AlertTriangle" : alert?.type === 'error' ? "XCircle" : "Info"} 
                size={16} 
                className="mt-0.5 flex-shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{alert?.title}</p>
                <p className="text-xs opacity-90 mt-1">{alert?.message}</p>
                {alert?.timestamp && (
                  <p className="text-xs opacity-75 mt-1">
                    {new Date(alert.timestamp)?.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RouteHeader;