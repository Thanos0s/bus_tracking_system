import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StopHeader = ({ 
  stopData, 
  onReportIssue, 
  onSetAlert, 
  onShareLocation 
}) => {
  const getAccessibilityIcon = (feature) => {
    switch (feature) {
      case 'wheelchair': return 'Accessibility';
      case 'audio': return 'Volume2';
      case 'visual': return 'Eye';
      case 'shelter': return 'Home';
      case 'seating': return 'Armchair';
      default: return 'Check';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      {/* Stop Identification */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="MapPin" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{stopData?.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="font-mono">Stop #{stopData?.code}</span>
                <span>•</span>
                <span>{stopData?.zone}</span>
              </div>
            </div>
          </div>
          
          {/* Location Details */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
            <Icon name="Navigation" size={16} />
            <span>{stopData?.address}</span>
          </div>
          
          {/* Operating Status */}
          <div className="flex items-center space-x-2">
            <div className={`status-dot ${stopData?.isOperational ? 'bg-success' : 'bg-error'}`}></div>
            <span className={`text-sm font-medium ${stopData?.isOperational ? 'text-success' : 'text-error'}`}>
              {stopData?.isOperational ? 'Operational' : 'Service Disrupted'}
            </span>
            {stopData?.lastUpdated && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  Updated {stopData?.lastUpdated?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onSetAlert}
            iconName="Bell"
            iconPosition="left"
            iconSize={16}
          >
            Set Alert
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onShareLocation}
            iconName="Share"
            iconSize={16}
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onReportIssue}
            iconName="Flag"
            iconSize={16}
          />
        </div>
      </div>
      {/* Routes Served */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-2">Routes Served</h3>
        <div className="flex flex-wrap gap-2">
          {stopData?.routes?.map((route) => (
            <div
              key={route?.id}
              className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-full text-sm"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: route?.color }}
              ></div>
              <span className="font-medium text-foreground">{route?.number}</span>
              <span className="text-muted-foreground">→ {route?.destination}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Amenities & Accessibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amenities */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {stopData?.amenities?.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-success/10 text-success px-2 py-1 rounded text-xs"
              >
                <Icon name={getAccessibilityIcon(amenity)} size={12} />
                <span className="capitalize">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accessibility Features */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Accessibility</h4>
          <div className="flex flex-wrap gap-2">
            {stopData?.accessibility?.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs"
              >
                <Icon name={getAccessibilityIcon(feature)} size={12} />
                <span className="capitalize">{feature?.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StopHeader;