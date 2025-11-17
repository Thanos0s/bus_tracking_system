import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationPermissionPrompt = ({
  onPermissionChange,
  triggerAfterInteractions = 3,
  showAfterDelay = 30000, // 30 seconds
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [interactionCount, setInteractionCount] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check initial notification permission status
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }

    // Check if user has previously dismissed
    const dismissed = localStorage.getItem('notification-prompt-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    // Track user interactions to show prompt at right time
    const handleInteraction = () => {
      if (permissionStatus === 'default' && !isDismissed) {
        setInteractionCount(prev => prev + 1);
      }
    };

    // Add interaction listeners
    document.addEventListener('click', handleInteraction);
    document.addEventListener('scroll', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [permissionStatus, isDismissed]);

  useEffect(() => {
    // Show prompt based on interaction count or delay
    if (permissionStatus === 'default' && !isDismissed) {
      if (interactionCount >= triggerAfterInteractions) {
        setIsVisible(true);
      } else {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, showAfterDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [interactionCount, triggerAfterInteractions, showAfterDelay, permissionStatus, isDismissed]);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      onPermissionChange?.(permission);

      if (permission === 'granted') {
        // Show a test notification
        new Notification('SmartTransit Notifications Enabled', {
          body: 'You\'ll now receive real-time bus arrival alerts and emergency notifications.',
          icon: '/favicon.ico',
          tag: 'welcome'
        });
        setIsVisible(false);
      } else if (permission === 'denied') {
        setShowDetails(true);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const handleDismiss = (permanent = false) => {
    setIsVisible(false);
    if (permanent) {
      setIsDismissed(true);
      localStorage.setItem('notification-prompt-dismissed', 'true');
    }
  };

  const getPermissionMessage = () => {
    switch (permissionStatus) {
      case 'granted':
        return {
          title: 'Notifications Enabled',
          message: 'You\'ll receive real-time transit alerts',
          icon: 'CheckCircle',
          iconColor: 'text-success'
        };
      case 'denied':
        return {
          title: 'Notifications Blocked',
          message: 'Enable in browser settings to receive alerts',
          icon: 'XCircle',
          iconColor: 'text-error'
        };
      default:
        return {
          title: 'Stay Updated with Real-Time Alerts',
          message: 'Get notified about bus arrivals, delays, and emergency updates',
          icon: 'Bell',
          iconColor: 'text-primary'
        };
    }
  };

  if (!isVisible || permissionStatus === 'granted' || !('Notification' in window)) {
    return null;
  }

  const messageConfig = getPermissionMessage();

  return (
    <div className={`fixed bottom-4 right-4 max-w-sm bg-card border border-border rounded-lg shadow-nav-strong z-200 ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start space-x-3 mb-3">
          <div className={`p-2 rounded-full bg-muted ${messageConfig?.iconColor}`}>
            <Icon name={messageConfig?.icon} size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-card-foreground">
              {messageConfig?.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {messageConfig?.message}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDismiss(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Benefits List */}
        {permissionStatus === 'default' && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Clock" size={12} className="text-success" />
              <span>Real-time bus arrival notifications</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="AlertTriangle" size={12} className="text-warning" />
              <span>Emergency alerts and service disruptions</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Route" size={12} className="text-primary" />
              <span>Route changes and delays</span>
            </div>
          </div>
        )}

        {/* Browser Instructions (when denied) */}
        {showDetails && permissionStatus === 'denied' && (
          <div className="mb-4 p-3 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground mb-2">
              To enable notifications:
            </p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Click the lock icon in your address bar</li>
              <li>Select "Allow" for notifications</li>
              <li>Refresh the page</li>
            </ol>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between space-x-2">
          {permissionStatus === 'default' ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDismiss(true)}
                className="text-xs"
              >
                Not now
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={requestPermission}
                className="text-xs"
                iconName="Bell"
                iconPosition="left"
                iconSize={14}
              >
                Enable Alerts
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-2 w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs flex-1"
              >
                {showDetails ? 'Hide' : 'Show'} Instructions
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDismiss(true)}
                className="text-xs"
              >
                Dismiss
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Progress indicator for interaction-based trigger */}
      {permissionStatus === 'default' && interactionCount < triggerAfterInteractions && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-lg overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(interactionCount / triggerAfterInteractions) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationPermissionPrompt;