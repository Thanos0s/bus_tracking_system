import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const RouteMap = ({ 
  route, 
  buses, 
  selectedStop, 
  onStopSelect,
  className = '' 
}) => {
  const [mapCenter, setMapCenter] = useState({ lat: 30.7333, lng: 76.7794 });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock route path coordinates
  const routePath = [
    { lat: 30.7333, lng: 76.7794 },
    { lat: 30.7350, lng: 76.7810 },
    { lat: 30.7380, lng: 76.7850 },
    { lat: 30.7420, lng: 76.7890 },
    { lat: 30.7450, lng: 76.7920 }
  ];

  const handleStopClick = (stop) => {
    onStopSelect(stop);
    setMapCenter({ lat: stop?.latitude, lng: stop?.longitude });
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 10));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const centerOnRoute = () => {
    setMapCenter({ lat: 30.7390, lng: 76.7840 });
    setZoomLevel(13);
  };

  return (
    <div className={`relative bg-card border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border p-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Icon name="Route" size={18} className="text-primary" />
              <span className="font-semibold text-sm text-card-foreground">
                {route?.name} - Live Tracking
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={centerOnRoute}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              title="Center on route"
            >
              <Icon name="Navigation" size={16} className="text-muted-foreground" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              <Icon name={isFullscreen ? "Minimize2" : "Maximize2"} size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
      {/* Map Container */}
      <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'h-96 lg:h-[500px]'}`}>
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title={`${route?.name} Route Map`}
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${zoomLevel}&output=embed`}
          className="w-full h-full"
        />

        {/* Map Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Bus Positions */}
          {buses?.map((bus) => (
            <div
              key={bus?.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              style={{
                left: `${((bus?.longitude - mapCenter?.lng + 0.01) / 0.02) * 100}%`,
                top: `${((mapCenter?.lat - bus?.latitude + 0.01) / 0.02) * 100}%`
              }}
            >
              <div className="relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                  bus?.status === 'on_time' ? 'bg-success' : 
                  bus?.status === 'delayed' ? 'bg-warning' : 'bg-error'
                } text-white`}>
                  <Icon name="Bus" size={16} />
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  Bus {bus?.number}
                </div>
              </div>
            </div>
          ))}

          {/* Bus Stops */}
          {route?.stops?.map((stop, index) => (
            <div
              key={stop?.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
              style={{
                left: `${((stop?.longitude - mapCenter?.lng + 0.01) / 0.02) * 100}%`,
                top: `${((mapCenter?.lat - stop?.latitude + 0.01) / 0.02) * 100}%`
              }}
              onClick={() => handleStopClick(stop)}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-lg ${
                selectedStop?.id === stop?.id 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-card border-primary text-primary'
              }`}>
                <span className="text-xs font-bold">{index + 1}</span>
              </div>
              {selectedStop?.id === stop?.id && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  {stop?.name}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-card border border-border rounded-md shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Icon name="Plus" size={16} className="text-foreground" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-card border border-border rounded-md shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Icon name="Minus" size={16} className="text-foreground" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-success rounded-full flex items-center justify-center">
                <Icon name="Bus" size={10} className="text-white" />
              </div>
              <span className="text-card-foreground">On Time</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-warning rounded-full flex items-center justify-center">
                <Icon name="Bus" size={10} className="text-white" />
              </div>
              <span className="text-card-foreground">Delayed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary border-2 border-primary rounded-full"></div>
              <span className="text-card-foreground">Bus Stop</span>
            </div>
          </div>
        </div>
      </div>
      {/* Route Statistics */}
      <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-3">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-card-foreground">{route?.stops?.length}</div>
            <div className="text-xs text-muted-foreground">Total Stops</div>
          </div>
          <div>
            <div className="text-lg font-bold text-card-foreground">{buses?.length}</div>
            <div className="text-xs text-muted-foreground">Active Buses</div>
          </div>
          <div>
            <div className="text-lg font-bold text-card-foreground">{route?.distance}km</div>
            <div className="text-xs text-muted-foreground">Route Length</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;