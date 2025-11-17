import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = ({ 
  selectedRoute, 
  onSetReminder, 
  onShareRoute, 
  onSaveRoute, 
  onStartNavigation,
  onDownloadOfflineMap 
}) => {
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [isRouteSaved, setIsRouteSaved] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const quickActions = [
    {
      id: 'navigate',
      label: 'Start Navigation',
      icon: 'Navigation',
      color: 'bg-primary text-primary-foreground',
      action: onStartNavigation,
      description: 'Begin turn-by-turn directions'
    },
    {
      id: 'reminder',
      label: isReminderSet ? 'Reminder Set' : 'Set Reminder',
      icon: isReminderSet ? 'BellRing' : 'Bell',
      color: isReminderSet ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground',
      action: () => {
        setIsReminderSet(!isReminderSet);
        onSetReminder?.(!isReminderSet);
      },
      description: 'Get notified before departure'
    },
    {
      id: 'save',
      label: isRouteSaved ? 'Route Saved' : 'Save Route',
      icon: isRouteSaved ? 'BookmarkCheck' : 'Bookmark',
      color: isRouteSaved ? 'bg-success text-success-foreground' : 'bg-accent text-accent-foreground',
      action: () => {
        setIsRouteSaved(!isRouteSaved);
        onSaveRoute?.(!isRouteSaved);
      },
      description: 'Save for future use'
    },
    {
      id: 'share',
      label: 'Share Route',
      icon: 'Share',
      color: 'bg-secondary text-secondary-foreground',
      action: () => setShowShareOptions(!showShareOptions),
      description: 'Share with friends or family'
    },
    {
      id: 'offline',
      label: 'Offline Map',
      icon: 'Download',
      color: 'bg-muted text-muted-foreground',
      action: onDownloadOfflineMap,
      description: 'Download for offline use'
    }
  ];

  const shareOptions = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: 'MessageCircle',
      color: 'text-success',
      action: () => {
        const message = `Check out my trip route: ${selectedRoute?.origin} to ${selectedRoute?.destination}. Estimated time: ${selectedRoute?.totalDuration} minutes.`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        setShowShareOptions(false);
      }
    },
    {
      id: 'sms',
      label: 'SMS',
      icon: 'MessageSquare',
      color: 'text-primary',
      action: () => {
        const message = `My trip route: ${selectedRoute?.origin} to ${selectedRoute?.destination}. ETA: ${selectedRoute?.totalDuration} min.`;
        window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
        setShowShareOptions(false);
      }
    },
    {
      id: 'email',
      label: 'Email',
      icon: 'Mail',
      color: 'text-warning',
      action: () => {
        const subject = 'Trip Route Details';
        const body = `Here are my trip details:\n\nFrom: ${selectedRoute?.origin}\nTo: ${selectedRoute?.destination}\nEstimated Duration: ${selectedRoute?.totalDuration} minutes\nEstimated Cost: ₹${selectedRoute?.estimatedCost}`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
        setShowShareOptions(false);
      }
    },
    {
      id: 'copy',
      label: 'Copy Link',
      icon: 'Copy',
      color: 'text-muted-foreground',
      action: () => {
        const routeUrl = `${window.location?.origin}/trip-planner?from=${encodeURIComponent(selectedRoute?.origin)}&to=${encodeURIComponent(selectedRoute?.destination)}`;
        navigator.clipboard?.writeText(routeUrl);
        setShowShareOptions(false);
        // You could add a toast notification here
      }
    }
  ];

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (!selectedRoute) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <Icon name="Route" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="font-medium text-foreground mb-2">No Route Selected</h3>
        <p className="text-sm text-muted-foreground">
          Select a route to see quick actions and options
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-nav-shadow">
      {/* Selected Route Summary */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="Route" size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Selected Route</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {selectedRoute?.type} • {formatDuration(selectedRoute?.totalDuration)}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={16} className="text-success" />
            <span className="text-muted-foreground">From:</span>
            <span className="text-foreground font-medium">{selectedRoute?.origin}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={16} className="text-error" />
            <span className="text-muted-foreground">To:</span>
            <span className="text-foreground font-medium">{selectedRoute?.destination}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              ₹{selectedRoute?.estimatedCost}
            </div>
            <div className="text-xs text-muted-foreground">Cost</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {selectedRoute?.transfers}
            </div>
            <div className="text-xs text-muted-foreground">Transfers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {selectedRoute?.walkingDistance}m
            </div>
            <div className="text-xs text-muted-foreground">Walking</div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="p-6">
        <h4 className="font-medium text-foreground mb-4">Quick Actions</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions?.map((action) => (
            <Button
              key={action?.id}
              variant="outline"
              size="default"
              onClick={action?.action}
              className={`justify-start h-auto p-4 ${action?.id === 'navigate' ? 'col-span-full' : ''}`}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className={`p-2 rounded-lg ${action?.color}`}>
                  <Icon name={action?.icon} size={20} />
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium">{action?.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {action?.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Share Options Dropdown */}
        {showShareOptions && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h5 className="font-medium text-foreground mb-3">Share via:</h5>
            <div className="grid grid-cols-2 gap-2">
              {shareOptions?.map((option) => (
                <Button
                  key={option?.id}
                  variant="ghost"
                  size="sm"
                  onClick={option?.action}
                  className="justify-start"
                >
                  <Icon name={option?.icon} size={16} className={`mr-2 ${option?.color}`} />
                  {option?.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Live Updates */}
        {selectedRoute?.liveStatus && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Radio" size={16} className="text-primary" />
              <span className="font-medium text-sm text-foreground">Live Updates</span>
            </div>
            <div className={`text-xs ${
              selectedRoute?.liveStatus?.type === 'delay' ? 'text-warning' :
              selectedRoute?.liveStatus?.type === 'ontime'? 'text-success' : 'text-error'
            }`}>
              {selectedRoute?.liveStatus?.message}
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            className="text-error border-error hover:bg-error/10"
            iconName="AlertTriangle"
            iconPosition="left"
            iconSize={16}
          >
            Emergency Assistance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;