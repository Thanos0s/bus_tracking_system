import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyAlertCard = ({ alert, onAction, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getAlertTypeConfig = () => {
    switch (alert?.type) {
      case 'passenger_sos':
        return {
          icon: 'AlertTriangle',
          bgColor: 'bg-error/10',
          borderColor: 'border-error',
          textColor: 'text-error',
          label: 'Passenger SOS'
        };
      case 'driver_panic':
        return {
          icon: 'Shield',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning',
          textColor: 'text-warning',
          label: 'Driver Panic'
        };
      case 'vehicle_breakdown':
        return {
          icon: 'Wrench',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary',
          textColor: 'text-primary',
          label: 'Vehicle Breakdown'
        };
      case 'medical_emergency':
        return {
          icon: 'Heart',
          bgColor: 'bg-error/10',
          borderColor: 'border-error',
          textColor: 'text-error',
          label: 'Medical Emergency'
        };
      default:
        return {
          icon: 'AlertCircle',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted',
          textColor: 'text-muted-foreground',
          label: 'General Alert'
        };
    }
  };

  const getPriorityColor = () => {
    switch (alert?.priority) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = () => {
    switch (alert?.status) {
      case 'active': return 'text-error';
      case 'responding': return 'text-warning';
      case 'resolved': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now - alertTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    return alertTime?.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const typeConfig = getAlertTypeConfig();

  return (
    <div className={`bg-card border-2 ${typeConfig?.borderColor} rounded-lg p-4 ${typeConfig?.bgColor} transition-all duration-200 hover:shadow-md`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${typeConfig?.bgColor} ${typeConfig?.textColor}`}>
            <Icon name={typeConfig?.icon} size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-card-foreground">{typeConfig?.label}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor()} bg-current/10`}>
                {alert?.priority?.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Bus {alert?.busId} • Route {alert?.routeNumber}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()} bg-current/10`}>
            {alert?.status?.toUpperCase()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>
      </div>
      {/* Basic Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
        <div>
          <p className="text-xs text-muted-foreground">Time</p>
          <p className="text-sm font-medium">{formatTimestamp(alert?.timestamp)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Passengers</p>
          <p className="text-sm font-medium">{alert?.passengerCount}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Location</p>
          <p className="text-sm font-medium">{alert?.location}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Response Time</p>
          <p className="text-sm font-medium">{alert?.responseTime || 'Pending'}</p>
        </div>
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border pt-3 space-y-3">
          {/* GPS Coordinates */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">GPS Coordinates</p>
              <p className="text-sm font-mono">{alert?.coordinates?.lat}, {alert?.coordinates?.lng}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(alert)}
              iconName="MapPin"
              iconPosition="left"
            >
              View on Map
            </Button>
          </div>

          {/* Description */}
          {alert?.description && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Description</p>
              <p className="text-sm text-card-foreground bg-muted/50 p-2 rounded">{alert?.description}</p>
            </div>
          )}

          {/* Contact Info */}
          {alert?.contactInfo && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Contact Information</p>
              <div className="flex items-center space-x-4 text-sm">
                <span>Driver: {alert?.contactInfo?.driver}</span>
                <span>Phone: {alert?.contactInfo?.phone}</span>
              </div>
            </div>
          )}

          {/* Actions Taken */}
          {alert?.actionsTaken && alert?.actionsTaken?.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Actions Taken</p>
              <div className="space-y-1">
                {alert?.actionsTaken?.map((action, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs">
                    <Icon name="CheckCircle" size={12} className="text-success" />
                    <span>{action?.action} - {action?.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border">
        <Button
          variant="default"
          size="sm"
          onClick={() => onAction(alert?.id, 'respond')}
          iconName="Phone"
          iconPosition="left"
          disabled={alert?.status === 'resolved'}
        >
          Contact Driver
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction(alert?.id, 'emergency_services')}
          iconName="Truck"
          iconPosition="left"
          disabled={alert?.status === 'resolved'}
        >
          Emergency Services
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction(alert?.id, 'notify_passengers')}
          iconName="Users"
          iconPosition="left"
          disabled={alert?.status === 'resolved'}
        >
          Notify Passengers
        </Button>
        
        {alert?.status !== 'resolved' && (
          <Button
            variant="success"
            size="sm"
            onClick={() => onAction(alert?.id, 'resolve')}
            iconName="CheckCircle"
            iconPosition="left"
          >
            Mark Resolved
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmergencyAlertCard;