import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onEmergencyAlert, className = '' }) => {
  const navigate = useNavigate();
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);

  // Mock favorite routes
  const favoriteRoutes = [
    { number: '42A', name: 'Home to Office', lastUsed: '2 hours ago' },
    { number: '15B', name: 'Hospital Route', lastUsed: '1 day ago' },
    { number: '8C', name: 'University', lastUsed: '3 days ago' }
  ];

  const handleEmergencyAlert = () => {
    if (emergencyActive) {
      // Cancel emergency
      setEmergencyActive(false);
      onEmergencyAlert?.(false);
    } else {
      // Show confirmation
      setShowEmergencyConfirm(true);
    }
  };

  const confirmEmergency = () => {
    setEmergencyActive(true);
    setShowEmergencyConfirm(false);
    onEmergencyAlert?.(true);
    
    // Auto-navigate to emergency response page
    setTimeout(() => {
      navigate('/emergency-response');
    }, 2000);
  };

  const quickActionItems = [
    {
      id: 'trip-planner',
      label: 'Plan Trip',
      icon: 'Route',
      description: 'Find best routes',
      color: 'bg-primary text-primary-foreground',
      action: () => navigate('/trip-planner')
    },
    {
      id: 'route-details',
      label: 'Routes',
      icon: 'Map',
      description: 'View all routes',
      color: 'bg-secondary text-secondary-foreground',
      action: () => navigate('/route-details')
    },
    {
      id: 'bus-stops',
      label: 'Bus Stops',
      icon: 'MapPin',
      description: 'Find stops nearby',
      color: 'bg-accent text-accent-foreground',
      action: () => navigate('/bus-stop-information')
    },
    {
      id: 'complaints',
      label: 'Report Issue',
      icon: 'MessageSquare',
      description: 'Report problems',
      color: 'bg-warning text-warning-foreground',
      action: () => {
        // Mock complaint form - would typically open a modal or navigate
        alert('Complaint form would open here');
      }
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Emergency Alert Button */}
      <div className="relative">
        <Button
          variant={emergencyActive ? "destructive" : "outline"}
          size="lg"
          onClick={handleEmergencyAlert}
          className={`w-full touch-target ${
            emergencyActive 
              ? 'animate-pulse bg-error text-error-foreground' 
              : 'border-error text-error hover:bg-error/10'
          }`}
          iconName={emergencyActive ? "Square" : "AlertTriangle"}
          iconPosition="left"
          iconSize={20}
        >
          {emergencyActive ? 'Cancel Emergency Alert' : 'SOS Emergency Alert'}
        </Button>

        {emergencyActive && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-error rounded-full animate-ping" />
        )}
      </div>
      {/* Emergency Confirmation Modal */}
      {showEmergencyConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <Icon name="AlertTriangle" size={48} className="text-error mx-auto mb-3" />
              <h3 className="font-semibold text-card-foreground mb-2">Emergency Alert</h3>
              <p className="text-sm text-muted-foreground">
                This will immediately notify emergency services and transport authorities. 
                Only use in genuine emergencies.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowEmergencyConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmEmergency}
                className="flex-1"
                iconName="AlertTriangle"
                iconPosition="left"
              >
                Confirm SOS
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {quickActionItems?.map(item => (
          <Button
            key={item?.id}
            variant="outline"
            onClick={item?.action}
            className="h-20 flex-col space-y-2 touch-target hover:scale-105 transition-transform"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item?.color}`}>
              <Icon name={item?.icon} size={16} />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-card-foreground">{item?.label}</div>
              <div className="text-xs text-muted-foreground">{item?.description}</div>
            </div>
          </Button>
        ))}
      </div>
      {/* Favorite Routes */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-card-foreground">Favorite Routes</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/route-details')}
          >
            <Icon name="Plus" size={14} />
          </Button>
        </div>

        <div className="space-y-2">
          {favoriteRoutes?.map(route => (
            <button
              key={route?.number}
              onClick={() => navigate(`/route-details?route=${route?.number}`)}
              className="w-full flex items-center justify-between p-3 bg-card rounded-md hover:bg-muted transition-colors touch-target"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    {route?.number}
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-card-foreground">
                    {route?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Used {route?.lastUsed}
                  </div>
                </div>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-card rounded-lg p-3">
          <div className="text-lg font-bold text-success">12</div>
          <div className="text-xs text-muted-foreground">Trips Today</div>
        </div>
        <div className="bg-card rounded-lg p-3">
          <div className="text-lg font-bold text-primary">45m</div>
          <div className="text-xs text-muted-foreground">Avg Wait</div>
        </div>
        <div className="bg-card rounded-lg p-3">
          <div className="text-lg font-bold text-accent">₹28</div>
          <div className="text-xs text-muted-foreground">Today's Cost</div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;