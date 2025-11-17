import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceAlerts = ({ className = '' }) => {
  const [alerts, setAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Mock service alerts
  const mockAlerts = [
    {
      id: 'alert1',
      type: 'disruption',
      severity: 'high',
      title: 'Route 42A Delayed',
      message: 'Traffic congestion on Madhya Marg causing 15-20 minute delays. Alternative routes available.',
      affectedRoutes: ['42A'],
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      estimatedDuration: '30 minutes',
      actionable: true,
      actions: [
        { label: 'View Alternative Routes', action: 'alternatives' },
        { label: 'Get Updates', action: 'subscribe' }
      ]
    },
    {
      id: 'alert2',
      type: 'maintenance',
      severity: 'medium',
      title: 'Sector 17 Stop Maintenance',
      message: 'Bus stop display system under maintenance. Use mobile app for real-time updates.',
      affectedRoutes: ['42A', '15B', '8C'],
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      estimatedDuration: '2 hours',
      actionable: false
    },
    {
      id: 'alert3',
      type: 'weather',
      severity: 'low',
      title: 'Weather Advisory',
      message: 'Light rain expected. Buses may experience minor delays. Carry umbrella.',
      affectedRoutes: ['all'],
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      estimatedDuration: '3 hours',
      actionable: false
    },
    {
      id: 'alert4',
      type: 'emergency',
      severity: 'critical',
      title: 'Emergency Vehicle Priority',
      message: 'Emergency vehicles have priority on main routes. Expect temporary delays.',
      affectedRoutes: ['15B', '22D'],
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      estimatedDuration: '15 minutes',
      actionable: true,
      actions: [
        { label: 'Track Emergency', action: 'track' }
      ]
    }
  ];

  useEffect(() => {
    // Load dismissed alerts from localStorage
    const dismissed = JSON.parse(localStorage.getItem('dismissed-alerts') || '[]');
    setDismissedAlerts(dismissed);

    // Filter out dismissed alerts
    const activeAlerts = mockAlerts?.filter(alert => !dismissed?.includes(alert?.id));
    setAlerts(activeAlerts);
  }, []);

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bgColor: 'bg-error/10',
          borderColor: 'border-error',
          textColor: 'text-error',
          icon: 'AlertTriangle'
        };
      case 'high':
        return {
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning',
          textColor: 'text-warning',
          icon: 'AlertCircle'
        };
      case 'medium':
        return {
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary',
          textColor: 'text-primary',
          icon: 'Info'
        };
      case 'low':
        return {
          bgColor: 'bg-muted',
          borderColor: 'border-muted-foreground',
          textColor: 'text-muted-foreground',
          icon: 'Bell'
        };
      default:
        return {
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          textColor: 'text-foreground',
          icon: 'Bell'
        };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'disruption': return 'AlertTriangle';
      case 'maintenance': return 'Wrench';
      case 'weather': return 'Cloud';
      case 'emergency': return 'Siren';
      default: return 'Bell';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return timestamp?.toLocaleDateString();
  };

  const handleDismissAlert = (alertId) => {
    const newDismissed = [...dismissedAlerts, alertId];
    setDismissedAlerts(newDismissed);
    localStorage.setItem('dismissed-alerts', JSON.stringify(newDismissed));
    
    setAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  const handleAlertAction = (alert, actionType) => {
    switch (actionType) {
      case 'alternatives':
        // Navigate to alternative routes
        console.log('Show alternative routes for', alert?.affectedRoutes);
        break;
      case 'subscribe':
        // Subscribe to updates
        console.log('Subscribe to updates for', alert?.id);
        break;
      case 'track':
        // Track emergency
        console.log('Track emergency', alert?.id);
        break;
      default:
        break;
    }
  };

  const visibleAlerts = showAll ? alerts : alerts?.slice(0, 3);

  if (alerts?.length === 0) {
    return (
      <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-3 text-success">
          <Icon name="CheckCircle" size={20} />
          <div>
            <h3 className="font-medium">All Systems Normal</h3>
            <p className="text-sm text-muted-foreground">No service alerts at this time</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-card-foreground flex items-center space-x-2">
          <Icon name="Bell" size={18} />
          <span>Service Alerts</span>
          {alerts?.length > 0 && (
            <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full">
              {alerts?.length}
            </span>
          )}
        </h2>
        
        {alerts?.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show All (${alerts?.length})`}
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {visibleAlerts?.map(alert => {
          const severityConfig = getSeverityConfig(alert?.severity);
          
          return (
            <div
              key={alert?.id}
              className={`border rounded-lg p-4 ${severityConfig?.bgColor} ${severityConfig?.borderColor}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                  <Icon 
                    name={getTypeIcon(alert?.type)} 
                    size={20} 
                    className={severityConfig?.textColor} 
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium ${severityConfig?.textColor}`}>
                      {alert?.title}
                    </h3>
                    <p className="text-sm text-card-foreground mt-1">
                      {alert?.message}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismissAlert(alert?.id)}
                  className="text-muted-foreground hover:text-foreground flex-shrink-0"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
              {/* Alert Metadata */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center space-x-4">
                  <span>{formatTimeAgo(alert?.timestamp)}</span>
                  {alert?.estimatedDuration && (
                    <span>Duration: {alert?.estimatedDuration}</span>
                  )}
                </div>
                
                {alert?.affectedRoutes && alert?.affectedRoutes?.[0] !== 'all' && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Bus" size={12} />
                    <span>Routes: {alert?.affectedRoutes?.join(', ')}</span>
                  </div>
                )}
              </div>
              {/* Action Buttons */}
              {alert?.actionable && alert?.actions && (
                <div className="flex items-center space-x-2">
                  {alert?.actions?.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAlertAction(alert, action?.action)}
                      className="text-xs"
                    >
                      {action?.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Alert Summary */}
      {alerts?.length > 0 && (
        <div className="bg-muted rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground">
            {alerts?.filter(a => a?.severity === 'critical')?.length > 0 && (
              <span className="text-error font-medium">
                {alerts?.filter(a => a?.severity === 'critical')?.length} critical
              </span>
            )}
            {alerts?.filter(a => a?.severity === 'critical')?.length > 0 && 
             alerts?.filter(a => a?.severity !== 'critical')?.length > 0 && ' • '}
            {alerts?.filter(a => a?.severity !== 'critical')?.length > 0 && (
              <span>
                {alerts?.filter(a => a?.severity !== 'critical')?.length} other alerts
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceAlerts;