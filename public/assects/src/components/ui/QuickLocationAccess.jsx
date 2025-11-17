import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const QuickLocationAccess = ({ 
  onLocationUpdate,
  className = '',
  showLabel = true,
  size = 'default'
}) => {
  const [locationStatus, setLocationStatus] = useState('idle'); // idle, requesting, granted, denied, unavailable
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isWatching, setIsWatching] = useState(false);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      setError('Geolocation is not supported by this browser');
    }

    // Cleanup watch on unmount
    return () => {
      if (watchId) {
        navigator.geolocation?.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      return;
    }

    setLocationStatus('requesting');
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
          accuracy: position?.coords?.accuracy,
          timestamp: new Date(position.timestamp)
        };
        
        setCurrentLocation(location);
        setLocationStatus('granted');
        onLocationUpdate?.(location);
      },
      (error) => {
        setLocationStatus('denied');
        switch (error?.code) {
          case error?.PERMISSION_DENIED:
            setError('Location access denied by user');
            break;
          case error?.POSITION_UNAVAILABLE:
            setError('Location information unavailable');
            break;
          case error?.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('An unknown error occurred');
            break;
        }
      },
      options
    );
  };

  const startWatching = () => {
    if (!navigator.geolocation || isWatching) return;

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000 // 1 minute
    };

    const id = navigator.geolocation?.watchPosition(
      (position) => {
        const location = {
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
          accuracy: position?.coords?.accuracy,
          timestamp: new Date(position.timestamp)
        };
        
        setCurrentLocation(location);
        setLocationStatus('granted');
        onLocationUpdate?.(location);
      },
      (error) => {
        setError('Failed to track location');
        setIsWatching(false);
      },
      options
    );

    setWatchId(id);
    setIsWatching(true);
  };

  const stopWatching = () => {
    if (watchId) {
      navigator.geolocation?.clearWatch(watchId);
      setWatchId(null);
      setIsWatching(false);
    }
  };

  const getStatusConfig = () => {
    switch (locationStatus) {
      case 'requesting':
        return {
          icon: 'Loader',
          iconClass: 'animate-spin',
          color: 'text-warning',
          label: 'Getting location...',
          disabled: true
        };
      case 'granted':
        return {
          icon: 'MapPin',
          iconClass: isWatching ? 'text-success animate-pulse' : 'text-success',
          color: 'text-success',
          label: isWatching ? 'Tracking location' : 'Location found',
          disabled: false
        };
      case 'denied':
        return {
          icon: 'MapPinOff',
          iconClass: 'text-error',
          color: 'text-error',
          label: 'Location denied',
          disabled: false
        };
      case 'unavailable':
        return {
          icon: 'MapPinOff',
          iconClass: 'text-muted-foreground',
          color: 'text-muted-foreground',
          label: 'Location unavailable',
          disabled: true
        };
      default:
        return {
          icon: 'MapPin',
          iconClass: 'text-muted-foreground',
          color: 'text-muted-foreground',
          label: 'Use my location',
          disabled: false
        };
    }
  };

  const formatLocation = (location) => {
    if (!location) return '';
    return `${location?.latitude?.toFixed(4)}, ${location?.longitude?.toFixed(4)}`;
  };

  const formatAccuracy = (accuracy) => {
    if (!accuracy) return '';
    return accuracy < 1000 ? `±${Math.round(accuracy)}m` : `±${(accuracy / 1000)?.toFixed(1)}km`;
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-2">
        {/* Main Location Button */}
        <Button
          variant={locationStatus === 'granted' ? 'default' : 'outline'}
          size={size}
          onClick={requestLocation}
          disabled={statusConfig?.disabled}
          className="touch-target"
          iconName={statusConfig?.icon}
          iconPosition="left"
          iconSize={size === 'sm' ? 14 : 16}
        >
          {showLabel && (
            <span className={`${statusConfig?.color} ${statusConfig?.iconClass}`}>
              {statusConfig?.label}
            </span>
          )}
        </Button>

        {/* Watch Toggle (when location is available) */}
        {locationStatus === 'granted' && (
          <Button
            variant={isWatching ? 'default' : 'outline'}
            size={size}
            onClick={isWatching ? stopWatching : startWatching}
            className="touch-target"
            iconName={isWatching ? 'Square' : 'Play'}
            iconPosition="left"
            iconSize={size === 'sm' ? 14 : 16}
          >
            {isWatching ? 'Stop' : 'Track'}
          </Button>
        )}
      </div>
      {/* Location Details */}
      {currentLocation && (
        <div className="mt-2 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={12} />
            <span className="font-mono">{formatLocation(currentLocation)}</span>
          </div>
          
          {currentLocation?.accuracy && (
            <div className="flex items-center space-x-2">
              <Icon name="Target" size={12} />
              <span>Accuracy: {formatAccuracy(currentLocation?.accuracy)}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={12} />
            <span>
              Updated: {currentLocation?.timestamp?.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      )}
      {/* Error Message */}
      {error && (
        <div className="mt-2 text-xs text-error flex items-center space-x-2">
          <Icon name="AlertCircle" size={12} />
          <span>{error}</span>
        </div>
      )}
      {/* Manual Location Entry Fallback */}
      {locationStatus === 'denied' && (
        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-primary"
            iconName="Edit"
            iconPosition="left"
            iconSize={12}
          >
            Enter location manually
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuickLocationAccess;