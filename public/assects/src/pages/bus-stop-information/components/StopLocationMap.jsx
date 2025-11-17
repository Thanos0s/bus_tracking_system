import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StopLocationMap = ({ stopData, nearbyStops, onNavigateToStop }) => {
  const [mapView, setMapView] = useState('satellite'); // satellite, roadmap, hybrid
  const [showNearbyStops, setShowNearbyStops] = useState(true);

  const mapUrl = `https://www.google.com/maps?q=${stopData?.coordinates?.lat},${stopData?.coordinates?.lng}&z=16&output=embed&maptype=${mapView}`;

  const getDistanceColor = (distance) => {
    if (distance <= 200) return 'text-success';
    if (distance <= 500) return 'text-warning';
    return 'text-muted-foreground';
  };

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${distance}m`;
    }
    return `${(distance / 1000)?.toFixed(1)}km`;
  };

  const getWalkingTime = (distance) => {
    // Average walking speed: 5 km/h = 83.33 m/min
    const minutes = Math.ceil(distance / 83.33);
    return `${minutes} min walk`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Icon name="Map" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Stop Location</h3>
          </div>
          
          {/* Map Controls */}
          <div className="flex items-center space-x-2">
            <select
              value={mapView}
              onChange={(e) => setMapView(e?.target?.value)}
              className="text-xs border border-border rounded px-2 py-1 bg-background text-foreground"
            >
              <option value="roadmap">Map</option>
              <option value="satellite">Satellite</option>
              <option value="hybrid">Hybrid</option>
            </select>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`https://www.google.com/maps?q=${stopData?.coordinates?.lat},${stopData?.coordinates?.lng}`, '_blank')}
              iconName="ExternalLink"
              iconSize={14}
            />
          </div>
        </div>

        {/* Location Details */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Navigation" size={14} />
            <span>{stopData?.coordinates?.lat?.toFixed(6)}, {stopData?.coordinates?.lng?.toFixed(6)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={14} />
            <span>{stopData?.landmark}</span>
          </div>
        </div>
      </div>
      {/* Interactive Map */}
      <div className="relative">
        <div className="h-64 md:h-80 overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title={`${stopData?.name} Location`}
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
            className="border-0"
          />
        </div>
        
        {/* Map Overlay Info */}
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-sm">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm font-medium text-foreground">{stopData?.name}</span>
          </div>
          <div className="text-xs text-muted-foreground">Stop #{stopData?.code}</div>
        </div>
      </div>
      {/* Nearby Stops Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-foreground">Nearby Stops</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNearbyStops(!showNearbyStops)}
            iconName={showNearbyStops ? "ChevronUp" : "ChevronDown"}
            iconSize={16}
          >
            {showNearbyStops ? 'Hide' : 'Show'}
          </Button>
        </div>

        {showNearbyStops && (
          <div className="space-y-3">
            {nearbyStops?.map((stop) => (
              <div
                key={stop?.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-background rounded-lg">
                    <Icon name="MapPin" size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{stop?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Stop #{stop?.code} • {stop?.routeCount} routes
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getDistanceColor(stop?.distance)}`}>
                      {formatDistance(stop?.distance)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getWalkingTime(stop?.distance)}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigateToStop(stop?.id)}
                    iconName="ArrowRight"
                    iconSize={14}
                  />
                </div>
              </div>
            ))}

            {nearbyStops?.length === 0 && (
              <div className="text-center py-4">
                <Icon name="MapPin" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No nearby stops found within 1km</p>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation?.getCurrentPosition((position) => {
                  const url = `https://www.google.com/maps/dir/${position?.coords?.latitude},${position?.coords?.longitude}/${stopData?.coordinates?.lat},${stopData?.coordinates?.lng}`;
                  window.open(url, '_blank');
                });
              }
            }}
            iconName="Navigation"
            iconPosition="left"
            iconSize={14}
          >
            Directions
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const url = `https://www.google.com/maps?q=${stopData?.coordinates?.lat},${stopData?.coordinates?.lng}`;
              if (navigator.share) {
                navigator.share({
                  title: stopData?.name,
                  text: `Bus Stop: ${stopData?.name}`,
                  url: url
                });
              } else {
                navigator.clipboard?.writeText(url);
              }
            }}
            iconName="Share"
            iconPosition="left"
            iconSize={14}
          >
            Share
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://www.google.com/maps/search/restaurants+near+${stopData?.coordinates?.lat},${stopData?.coordinates?.lng}`, '_blank')}
            iconName="Coffee"
            iconPosition="left"
            iconSize={14}
          >
            Nearby
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://www.google.com/maps/@${stopData?.coordinates?.lat},${stopData?.coordinates?.lng},3a,75y,90t/data=!3m6!1e1`, '_blank')}
            iconName="Eye"
            iconPosition="left"
            iconSize={14}
          >
            Street View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StopLocationMap;