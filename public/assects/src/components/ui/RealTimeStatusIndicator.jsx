import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const RealTimeStatusIndicator = ({ 
  className = '',
  showDetails = false,
  onStatusChange 
}) => {
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Simulate WebSocket connection monitoring
    const interval = setInterval(() => {
      const now = new Date();
      setLastUpdate(now);
      
      // Simulate occasional connection issues (5% chance)
      if (Math.random() > 0.95) {
        setConnectionStatus('reconnecting');
        setRetryCount(prev => prev + 1);
        
        // Simulate reconnection after 2-5 seconds
        setTimeout(() => {
          setConnectionStatus('connected');
          setRetryCount(0);
        }, Math.random() * 3000 + 2000);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    onStatusChange?.(connectionStatus, lastUpdate);
  }, [connectionStatus, lastUpdate, onStatusChange]);

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          color: 'text-success',
          bgColor: 'bg-success',
          icon: 'Wifi',
          label: 'Connected',
          description: 'Real-time data active'
        };
      case 'reconnecting':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning',
          icon: 'RotateCcw',
          label: 'Reconnecting',
          description: `Attempt ${retryCount + 1}`
        };
      case 'disconnected':
        return {
          color: 'text-error',
          bgColor: 'bg-error',
          icon: 'WifiOff',
          label: 'Disconnected',
          description: 'No real-time data'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted-foreground',
          icon: 'Loader',
          label: 'Connecting',
          description: 'Initializing...'
        };
    }
  };

  const formatLastUpdate = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    return date?.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`relative ${className}`}>
      {/* Compact Status Indicator */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 text-xs hover:bg-muted/50 rounded-md px-2 py-1 transition-colors touch-target"
      >
        <div className="relative">
          <div 
            className={`status-dot ${statusConfig?.color} ${connectionStatus === 'connected' ? 'pulse-status' : ''}`}
            style={{ backgroundColor: 'currentColor' }}
          />
          {connectionStatus === 'reconnecting' && (
            <Icon 
              name="RotateCcw" 
              size={8} 
              className="absolute -top-1 -right-1 animate-spin text-warning" 
            />
          )}
        </div>
        
        <span className="text-muted-foreground font-mono hidden sm:inline">
          {formatLastUpdate(lastUpdate)}
        </span>
        
        {showDetails && (
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={12} 
            className="text-muted-foreground" 
          />
        )}
      </button>
      {/* Expanded Details */}
      {isExpanded && showDetails && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-popover border border-border rounded-md shadow-nav-strong z-150 p-3">
          <div className="space-y-3">
            {/* Status Header */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${statusConfig?.bgColor}/10`}>
                <Icon 
                  name={statusConfig?.icon} 
                  size={16} 
                  className={`${statusConfig?.color} ${connectionStatus === 'reconnecting' ? 'animate-spin' : ''}`} 
                />
              </div>
              <div>
                <div className="font-medium text-sm text-popover-foreground">
                  {statusConfig?.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {statusConfig?.description}
                </div>
              </div>
            </div>

            {/* Connection Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Update:</span>
                <span className="font-mono text-popover-foreground">
                  {lastUpdate?.toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Source:</span>
                <span className="text-popover-foreground">WebSocket</span>
              </div>
              
              {retryCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Retry Count:</span>
                  <span className="text-warning">{retryCount}</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-border">
              <button
                onClick={() => {
                  setConnectionStatus('reconnecting');
                  setTimeout(() => setConnectionStatus('connected'), 2000);
                }}
                className="w-full text-xs text-primary hover:bg-primary/10 py-2 rounded-md transition-colors"
              >
                Force Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeStatusIndicator;