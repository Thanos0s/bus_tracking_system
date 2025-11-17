import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const EmergencyAlertBanner = ({ 
  isActive = false, 
  onDismiss, 
  alertType = 'general',
  message = 'Emergency Alert Active',
  details = 'All emergency services have been notified',
  autoHide = false,
  duration = 10000 
}) => {
  const [isVisible, setIsVisible] = useState(isActive);
  const [timeRemaining, setTimeRemaining] = useState(duration / 1000);

  useEffect(() => {
    setIsVisible(isActive);
    if (isActive && autoHide) {
      setTimeRemaining(duration / 1000);
    }
  }, [isActive, autoHide, duration]);

  useEffect(() => {
    if (!isVisible || !autoHide) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsVisible(false);
          onDismiss?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, autoHide, onDismiss]);

  const getAlertConfig = () => {
    switch (alertType) {
      case 'critical':
        return {
          bgClass: 'bg-gradient-to-r from-error to-red-600',
          icon: 'AlertTriangle',
          iconClass: 'animate-pulse'
        };
      case 'warning':
        return {
          bgClass: 'bg-gradient-to-r from-warning to-amber-600',
          icon: 'AlertCircle',
          iconClass: 'animate-bounce'
        };
      case 'info':
        return {
          bgClass: 'bg-gradient-to-r from-primary to-blue-600',
          icon: 'Info',
          iconClass: ''
        };
      default:
        return {
          bgClass: 'emergency-alert',
          icon: 'AlertTriangle',
          iconClass: 'animate-pulse'
        };
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const alertConfig = getAlertConfig();

  return (
    <div className={`${alertConfig?.bgClass} text-white px-4 py-3 relative z-200 shadow-emergency`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Icon 
              name={alertConfig?.icon} 
              size={20} 
              className={alertConfig?.iconClass} 
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-sm sm:text-base">{message}</span>
                {details && (
                  <span className="text-xs sm:text-sm opacity-90 hidden sm:inline">
                    {details}
                  </span>
                )}
              </div>
              {/* Mobile details */}
              {details && (
                <div className="text-xs opacity-90 mt-1 sm:hidden">
                  {details}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 ml-4">
            {/* Auto-hide countdown */}
            {autoHide && timeRemaining > 0 && (
              <div className="hidden sm:flex items-center space-x-2 text-xs opacity-75">
                <Icon name="Clock" size={14} />
                <span className="font-mono">{timeRemaining}s</span>
              </div>
            )}

            {/* Dismiss button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 touch-target flex-shrink-0"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Progress bar for auto-hide */}
        {autoHide && timeRemaining > 0 && (
          <div className="mt-2 w-full bg-white/20 rounded-full h-1">
            <div 
              className="bg-white h-1 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(timeRemaining / (duration / 1000)) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyAlertBanner;
