import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceAlerts = ({ stopId }) => {
  const [alerts, setAlerts] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Mock service alerts data
  const mockAlerts = [
    {
      id: 'alert_001',
      type: 'disruption',
      severity: 'high',
      title: 'Route 15A Service Disruption',
      message: `Due to road construction on Mall Road, Route 15A buses are experiencing delays of 10-15 minutes.\n\nAlternative routes: Take Route 22B to Central Plaza and transfer to Route 8C.`,
      affectedRoutes: ['15A'],
      startTime: new Date(Date.now() - 3600000), // 1 hour ago
      estimatedEndTime: new Date(Date.now() + 7200000), // 2 hours from now
      isActive: true,
      source: 'Traffic Management'
    },
    {
      id: 'alert_002',
      type: 'maintenance',
      severity: 'medium',
      title: 'Stop Maintenance Scheduled',
      message: `Scheduled maintenance work at this bus stop on December 25, 2024 from 10:00 PM to 6:00 AM.\n\nTemporary stop location: 50 meters ahead near the traffic signal.`,
      affectedRoutes: ['15A', '22B', '8C'],
      startTime: new Date('2024-12-25T22:00:00'),
      estimatedEndTime: new Date('2024-12-26T06:00:00'),
      isActive: false,
      source: 'Maintenance Department'
    },
    {
      id: 'alert_003',
      type: 'weather',
      severity: 'low',
      title: 'Weather Advisory',
      message: `Heavy rain expected this evening. Buses may experience minor delays.\n\nPassengers are advised to carry umbrellas and allow extra travel time.`,
      affectedRoutes: ['all'],
      startTime: new Date(Date.now() + 3600000), // 1 hour from now
      estimatedEndTime: new Date(Date.now() + 21600000), // 6 hours from now
      isActive: false,
      source: 'Weather Service'
    }
  ];

  React.useEffect(() => {
    setAlerts(mockAlerts);
  }, [stopId]);

  const getAlertConfig = (type, severity) => {
    const configs = {
      disruption: {
        high: { icon: 'AlertTriangle', color: 'text-error', bg: 'bg-error/10', border: 'border-error/20' },
        medium: { icon: 'AlertCircle', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
        low: { icon: 'Info', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' }
      },
      maintenance: {
        high: { icon: 'Wrench', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
        medium: { icon: 'Settings', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
        low: { icon: 'Tool', color: 'text-muted-foreground', bg: 'bg-muted/50', border: 'border-muted' }
      },
      weather: {
        high: { icon: 'CloudRain', color: 'text-error', bg: 'bg-error/10', border: 'border-error/20' },
        medium: { icon: 'Cloud', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
        low: { icon: 'CloudDrizzle', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' }
      }
    };

    return configs?.[type]?.[severity] || configs?.disruption?.low;
  };

  const formatTimeRange = (start, end) => {
    const now = new Date();
    const startStr = start?.toLocaleDateString() === now?.toLocaleDateString() 
      ? start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : start?.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    const endStr = end?.toLocaleDateString() === now?.toLocaleDateString()
      ? end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : end?.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return `${startStr} - ${endStr}`;
  };

  const getTimeStatus = (start, end) => {
    const now = new Date();
    if (now < start) return 'upcoming';
    if (now > end) return 'ended';
    return 'active';
  };

  const activeAlerts = alerts?.filter(alert => alert?.isActive || getTimeStatus(alert?.startTime, alert?.estimatedEndTime) === 'active');
  const displayAlerts = showAll ? alerts : activeAlerts?.slice(0, 3);

  if (alerts?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center">
          <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">All Systems Normal</h3>
          <p className="text-muted-foreground">No service alerts or disruptions at this time.</p>
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
            <Icon name="AlertCircle" size={20} className="text-warning" />
            <h3 className="text-lg font-semibold text-foreground">Service Alerts</h3>
            {activeAlerts?.length > 0 && (
              <div className="bg-warning text-warning-foreground px-2 py-1 rounded-full text-xs font-medium">
                {activeAlerts?.length} Active
              </div>
            )}
          </div>
          
          {alerts?.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              iconName={showAll ? "ChevronUp" : "ChevronDown"}
              iconSize={16}
            >
              {showAll ? 'Show Less' : `Show All (${alerts?.length})`}
            </Button>
          )}
        </div>
      </div>
      {/* Alerts List */}
      <div className="divide-y divide-border">
        {displayAlerts?.map((alert) => {
          const config = getAlertConfig(alert?.type, alert?.severity);
          const timeStatus = getTimeStatus(alert?.startTime, alert?.estimatedEndTime);
          
          return (
            <div key={alert?.id} className={`p-4 ${config?.bg} ${config?.border} border-l-4`}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-background/50 ${config?.color}`}>
                  <Icon name={config?.icon} size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Alert Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{alert?.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          timeStatus === 'active' ? 'bg-error text-error-foreground' :
                          timeStatus === 'upcoming' ? 'bg-warning text-warning-foreground' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {timeStatus === 'active' ? 'Active Now' :
                           timeStatus === 'upcoming' ? 'Upcoming' : 'Ended'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {alert?.source}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Alert Message */}
                  <div className="text-sm text-foreground mb-3 whitespace-pre-line">
                    {alert?.message}
                  </div>

                  {/* Affected Routes */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs text-muted-foreground">Affected routes:</span>
                    <div className="flex flex-wrap gap-1">
                      {alert?.affectedRoutes?.map((route) => (
                        <span
                          key={route}
                          className="text-xs bg-background/70 text-foreground px-2 py-1 rounded border"
                        >
                          {route === 'all' ? 'All Routes' : `Route ${route}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Time Information */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{formatTimeRange(alert?.startTime, alert?.estimatedEndTime)}</span>
                    </div>
                    
                    {timeStatus === 'active' && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Timer" size={12} />
                        <span>
                          Ends in {Math.ceil((alert?.estimatedEndTime - new Date()) / (1000 * 60 * 60))}h
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location?.reload()}
              iconName="RefreshCw"
              iconSize={14}
            >
              Refresh
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Bell"
              iconSize={14}
            >
              Alert Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAlerts;